// import { initRewardEntry } from "@nazaire/pixelguild-staking/dist/cjs/programs/rewardDistributor/instruction";
// import {
//   findRewardDistributorId,
//   findRewardEntryId,
// } from "@nazaire/pixelguild-staking/dist/cjs/programs/rewardDistributor/pda";
// import { findStakeAuthorizationId } from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/pda";
// import { withInitStakeEntry } from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/transaction";
// import { findStakeEntryIdFromMint } from "@nazaire/pixelguild-staking/dist/cjs/programs/stakePool/utils";
// import { Wallet } from "@project-serum/anchor";
// import {
//   AccountInfo,
//   Connection,
//   PublicKey,
//   Transaction,
// } from "@solana/web3.js";
// import { useAccount } from "../state/accounts";
// import { PixelGuildAccount } from "../types/PixelGuildAccount.enum";

// export async function createAscensionInitStakeTransaction(params: {
//   loader: (pubkey: PublicKey) => Promise<AccountInfo<Buffer> | Error | null>;
//   connection: Connection;
//   mint: PublicKey;
//   payer: PublicKey;
// }) {
//   const debug: any = {
//     mint: params.mint.toString(),
//     payer: params.payer.toString(),
//   };

//   const connection = params.connection;
//   const authorityWallet = {
//     publicKey: useAccount(PixelGuildAccount.STAKING_AUTHORITY),
//   } as Wallet;
//   const payerWallet = {
//     publicKey: params.payer,
//   } as Wallet;

//   const stakePoolId = useAccount(PixelGuildAccount.ASCENSION_STAKE_POOL);

//   const transaction = new Transaction();
//   transaction.feePayer = params.payer;

//   const [stakeAuthorizationId] = await findStakeAuthorizationId(
//     stakePoolId,
//     params.mint
//   );
//   const [stakeEntryId] = await findStakeEntryIdFromMint(
//     connection,
//     params.payer,
//     stakePoolId,
//     params.mint
//   );
//   const [rewardDistributorId] = await findRewardDistributorId(stakePoolId);
//   const [rewardEntryId] = await findRewardEntryId(
//     rewardDistributorId,
//     stakeEntryId
//   );

//   // 0. LOAD ACCOUNTS (NEED TO KNOW IF WE MUST CREATE THEM)

//   const [stakeEntryData, rewardEntryData] = await Promise.all([
//     params.loader(stakeAuthorizationId),
//     params.loader(stakeEntryId),
//     params.loader(rewardEntryId),
//   ] as const);

//   // 1. AUTHORIZE THE MINT

//   // if (!authorizeStakeEntryData) {
//   //   debug.create_authorize_stake_entry = true;
//   //   transaction.add(
//   //     await authorizeStakeEntry(connection, authorityWallet, {
//   //       stakePoolId,
//   //       originalMintId: params.mint,
//   //       authority: useAccount(PixelGuildAccount.STAKING_AUTHORITY),
//   //       payer: params.payer,
//   //     })
//   //   );
//   // }

//   // 2. INIT THE STAKE ENTRY

//   if (!stakeEntryData) {
//     debug.init_stake_entry = true;
//     await withInitStakeEntry(transaction, connection, payerWallet, {
//       stakePoolId: stakePoolId,
//       originalMintId: params.mint,
//     });
//   }

//   // 3. INIT THE REWARD ENTRY

//   if (!rewardEntryData) {
//     debug.init_reward_entry = true;
//     transaction.add(
//       await initRewardEntry(connection, authorityWallet, {
//         stakeEntryId,
//         rewardDistributor: rewardDistributorId,
//         payer: params.payer,
//         rewardEntryId,
//       })
//     );
//   }

//   console.log("createAscensionInitStakeTransaction", debug);

//   return transaction;
// }
