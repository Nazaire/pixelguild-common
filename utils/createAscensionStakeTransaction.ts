import { useAccount } from "@common/state/accounts";
import { IGuildieInfo } from "@common/types/IGuildieInfo";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { findAssociatedTokenAccountPda } from "@metaplex-foundation/js";
import {
  initRewardEntry,
  updateRewardEntry,
} from "@nazaire/pixelguild-staking/dist/cjs/programs/rewardDistributor/instruction";
import {
  findRewardDistributorId,
  findRewardEntryId,
} from "@nazaire/pixelguild-staking/dist/cjs/programs/rewardDistributor/pda";
import { ReceiptType } from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool";
import {
  authorizeStakeEntry,
  deauthorizeStakeEntry,
} from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/instruction";
import { findStakeAuthorizationId } from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/pda";
import {
  withClaimReceiptMint,
  withInitStakeEntry,
  withStake,
} from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/transaction";
import { findStakeEntryIdFromMint } from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/utils";
import type { Wallet } from "@saberhq/solana-contrib";
import { createTransferInstruction } from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { BN } from "bn.js";
import { pick } from "lodash";

export async function createAscensionStakeTransaction(params: {
  loader: (pubkey: PublicKey) => Promise<AccountInfo<Buffer> | Error | null>;
  blockhash: string;
  connection: Connection;
  mint: PublicKey;
  rarity: IGuildieInfo["rarity"];
  payer: PublicKey;
  paymentAmount: number;
}) {
  console.log({
    createAscensionStakeTransaction: {
      blockhash: params.blockhash,
      mint: params.mint.toString(),
      payer: params.payer.toString(),
      rarity: params.rarity,
      paymentAmount: params.paymentAmount,
    },
  });

  const debug: any = {
    blockhash: params.blockhash,
    mint: params.mint.toString(),
    payer: params.payer.toString(),
    rarity: params.rarity,
    paymentAmount: params.paymentAmount,
  };

  const connection = params.connection;
  const authorityWallet = {
    publicKey: useAccount(PixelGuildAccount.STAKING_AUTHORITY),
  } as Wallet;
  const payerWallet = {
    publicKey: params.payer,
  } as Wallet;

  const stakePoolId = useAccount(PixelGuildAccount.ASCENSION_STAKE_POOL);

  const transaction = new Transaction();
  transaction.recentBlockhash = params.blockhash;
  transaction.feePayer = params.payer;

  // $PIXEL transfer
  const pixel = useAccount(PixelGuildAccount.PIXEL);
  const source = findAssociatedTokenAccountPda(pixel, params.payer);
  const destination = findAssociatedTokenAccountPda(
    pixel,
    useAccount(PixelGuildAccount.DRAIN)
  );
  debug.transfer_souce = source.toString();
  debug.transfer_destination = destination.toString();
  transaction.add(
    createTransferInstruction(
      source,
      destination,
      params.payer,
      params.paymentAmount * 1e6 // $PIXEL decimals = 6
    )
  );

  const mintTokenAccountId = findAssociatedTokenAccountPda(
    params.mint,
    params.payer
  );

  const [stakeAuthorizationId] = await findStakeAuthorizationId(
    stakePoolId,
    params.mint
  );
  const [stakeEntryId] = await findStakeEntryIdFromMint(
    connection,
    params.payer,
    stakePoolId,
    params.mint
  );
  const [rewardDistributorId] = await findRewardDistributorId(stakePoolId);
  const [rewardEntryId] = await findRewardEntryId(
    rewardDistributorId,
    stakeEntryId
  );

  // 0. LOAD ACCOUNTS (NEED TO KNOW IF WE MUST CREATE THEM)

  const [authorizeStakeEntryData, stakeEntryData, rewardEntryData] =
    await Promise.all([
      params.loader(stakeAuthorizationId),
      params.loader(stakeEntryId),
      params.loader(rewardEntryId),
    ] as const);

  // 1. AUTHORIZE THE MINT

  if (!authorizeStakeEntryData) {
    debug.create_authorize_stake_entry = true;
    transaction.add(
      await authorizeStakeEntry(connection, authorityWallet, {
        stakePoolId,
        originalMintId: params.mint,
        authority: useAccount(PixelGuildAccount.STAKING_AUTHORITY),
        payer: params.payer,
      })
    );
  }

  // 2. INIT THE STAKE ENTRY

  if (!stakeEntryData) {
    debug.init_stake_entry = true;
    await withInitStakeEntry(transaction, connection, payerWallet, {
      stakePoolId: stakePoolId,
      originalMintId: params.mint,
    });
  }

  // 3. INIT THE REWARD ENTRY

  if (!rewardEntryData) {
    debug.init_reward_entry = true;
    transaction.add(
      await initRewardEntry(connection, authorityWallet, {
        stakeEntryId,
        rewardDistributor: rewardDistributorId,
        payer: params.payer,
        rewardEntryId,
      })
    );
  }

  // 4. UPDATE THE REWARD MULTIPLIER

  const multiplier = getAscensionMultiplierForRarity(params.rarity);

  debug.multiplier = multiplier;
  transaction.add(
    await updateRewardEntry(connection, authorityWallet, {
      stakePoolId,
      stakeEntryId,
      multiplier: new BN(multiplier),
    })
  );

  // 5. STAKE THE TOKEN

  await withStake(transaction, connection, payerWallet, {
    stakePoolId: stakePoolId,
    originalMintId: params.mint,
    userOriginalMintTokenAccountId: mintTokenAccountId,
    amount: new BN(1),
  });

  // 6. CLAIM ORIGINAL MINT RECEIPT

  // await withClaimReceiptMint(transaction, connection, payerWallet, {
  //   stakePoolId: stakePoolId,
  //   stakeEntryId: stakeEntryId,
  //   originalMintId: params.mint,
  //   receiptMintId: params.mint,
  //   receiptType: ReceiptType.Original,
  // });

  // 6. DEAUTHORIZE THE MINT
  transaction.add(
    await deauthorizeStakeEntry(connection, authorityWallet, {
      stakePoolId,
      originalMintId: params.mint,
    })
  );

  console.log("createAscensionStakeTransaction", debug);

  return { transaction, stakeEntryId };
}

export function getAscensionMultiplierForRarity(
  rarity: IGuildieInfo["rarity"]
): number {
  switch (rarity) {
    case "common":
      return 100;
    case "uncommon":
      return 105;
    case "rare":
      return 110;
    case "epic":
      return 120;
    case "legendary":
      return 130;
    case "mythic":
      return 140;
    case "king":
      return 200;
  }
}
