import { tryGetAccount } from "@cardinal/common";
import {
  findRewardDistributorId,
  findRewardEntryId,
} from "@nazaire/cardinal-staking/dist/cjs/programs/rewardDistributor/pda";
import { useAccount } from "@common/state/accounts";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { findAssociatedTokenAccountPda } from "@metaplex-foundation/js";
import {
  initRewardEntry,
  updateRewardEntry,
} from "@nazaire/cardinal-staking/dist/cjs/programs/rewardDistributor/instruction";
import {
  getStakeAuthorization,
  getStakeEntry,
} from "@nazaire/cardinal-staking/dist/cjs/programs/stakePool/accounts";
import { getRewardEntry } from "@nazaire/cardinal-staking/dist/cjs/programs/rewardDistributor/accounts";
import {
  authorizeStakeEntry,
  deauthorizeStakeEntry,
} from "@nazaire/cardinal-staking/dist/cjs/programs/stakePool/instruction";
import { findStakeAuthorizationId } from "@nazaire/cardinal-staking/dist/cjs/programs/stakePool/pda";
import {
  withInitStakeEntry,
  withStake,
} from "@nazaire/cardinal-staking/dist/cjs/programs/stakePool/transaction";
import { findStakeEntryIdFromMint } from "@nazaire/cardinal-staking/dist/cjs/programs/stakePool/utils";
import { Wallet } from "@project-serum/anchor";
import { createTransferInstruction } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { pick } from "lodash";
import { IGuildieInfo } from "@common/types/IGuildieInfo";

export async function createAscensionStakeTransaction(params: {
  blockhash: string;
  connection: Connection;
  wallet: Wallet;
  mint: PublicKey;
  rarity: IGuildieInfo["rarity"];
  payer: PublicKey;
  paymentAmount: number;
}) {
  console.log({
    createAscensionStakeTransaction: JSON.stringify(
      pick(params, ["blockhash", "mint", "payer", "paymentAmount"]),
      null,
      4
    ),
  });
  const connection = params.connection;
  const authorityWallet = new Wallet({
    publicKey: useAccount(PixelGuildAccount.STAKING_AUTHORITY),
  } as Keypair);
  const payerWallet = new Wallet({
    publicKey: params.payer,
  } as Keypair);

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

  // 1. AUTHORIZE THE MINT

  const authorizeStakeEntryData = await tryGetAccount(() =>
    getStakeAuthorization(connection, stakeAuthorizationId)
  );

  if (!authorizeStakeEntryData)
    transaction.add(
      await authorizeStakeEntry(connection, authorityWallet, {
        stakePoolId,
        originalMintId: params.mint,
        authority: useAccount(PixelGuildAccount.STAKING_AUTHORITY),
        payer: params.payer,
      })
    );

  // 2. INIT THE STAKE ENTRY

  const stakeEntryData = await tryGetAccount(() =>
    getStakeEntry(connection, stakeEntryId)
  );
  if (!stakeEntryData) {
    await withInitStakeEntry(transaction, connection, payerWallet, {
      stakePoolId: stakePoolId,
      originalMintId: params.mint,
    });
  }

  // 3. INIT THE REWARD ENTRY

  const rewardEntryData = await tryGetAccount(() =>
    getRewardEntry(connection, rewardEntryId)
  );

  if (!rewardEntryData) {
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

  // 6. DEAUTHORIZE THE MINT
  transaction.add(
    await deauthorizeStakeEntry(connection, authorityWallet, {
      stakePoolId,
      originalMintId: params.mint,
    })
  );

  return transaction;
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
