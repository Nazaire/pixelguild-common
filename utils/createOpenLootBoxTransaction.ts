import { useAccount } from "@common/state/accounts";
import { ILootBoxConfig } from "@common/types/LootBoxConfig";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import {
  findMasterEditionV2Pda,
  findMetadataPda,
  TokenProgram,
} from "@metaplex-foundation/js";
import { createBurnNftInstruction } from "@metaplex-foundation/mpl-token-metadata";
import {
  createAssociatedTokenAccountInstruction,
  createBurnInstruction,
  createCloseAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { flatMap, get, reduce } from "lodash";

export async function createOpenLootBoxTransaction(
  config: ILootBoxConfig,
  params: {
    connection: Connection;
    user: PublicKey;
    creators?: Record<string, string[]>;
    blockHash: string;
  }
) {
  const instructions: TransactionInstruction[] = [];

  /**
   * Add enough fees to cover the reward mint
   */
  instructions.push(
    SystemProgram.transfer({
      fromPubkey: params.user,
      toPubkey: useAccount(PixelGuildAccount.AUTHORITY),
      lamports: 12000000,
    })
  );

  for (const input of config.inputs) {
    if (input.creator) {
      const mints: string[] = get(params, `creators.${input.creator}`) || [];

      if (mints.length !== input.amount) {
        throw `Expected ${input.amount} mints for creator ${input.creator}. Got ${mints.length}.`;
      }
    }

    switch (input.method) {
      case "burn":
        if (input.creator) {
          const mints: string[] =
            get(params, `creators.${input.creator}`) || [];

          const burnInstructions = flatMap(
            mints.map((mint) => {
              const mintPk = new PublicKey(mint);
              // we assume these are nft accounts with an amount of 1
              return [
                createBurnNftInstruction({
                  owner: params.user,
                  mint: mintPk,
                  metadata: findMetadataPda(mintPk),
                  masterEditionAccount: findMasterEditionV2Pda(mintPk),
                  tokenAccount: getAssociatedTokenAddressSync(
                    mintPk,
                    params.user
                  ),
                  splTokenProgram: TokenProgram.publicKey,
                }),
              ];
            })
          );

          instructions.push(...burnInstructions);
        } else if (input.token) {
          // traditional token burn

          const accountPk = getAssociatedTokenAddressSync(
            new PublicKey(input.token!),
            params.user
          );

          const account = await params.connection.getTokenAccountBalance(
            accountPk
          );

          instructions.push(
            createBurnInstruction(
              getAssociatedTokenAddressSync(
                new PublicKey(input.token!),
                params.user
              ),
              new PublicKey(input.token!),
              params.user,
              input.amount
            )
          );

          if (account.value.uiAmount === 1) {
            instructions.push(
              createCloseAccountInstruction(
                accountPk,
                useAccount(PixelGuildAccount.DRAIN),
                params.user
              )
            );
          }
        } else {
          throw `Expected a creators or mint field to be set: ${JSON.stringify(
            input
          )}`;
        }
        break;
      case "transfer":
        if (input.creator) {
          const mints: string[] =
            get(params, `creators.${input.creator}`) || [];

          const transferInstructions = flatMap(
            mints.map((mint) => {
              const mintPk = new PublicKey(mint);

              const source = getAssociatedTokenAddressSync(mintPk, params.user);

              const destination = getAssociatedTokenAddressSync(
                mintPk,
                useAccount(PixelGuildAccount.DRAIN)
              );

              const instructions: TransactionInstruction[] = [];

              // we assume these are nft accounts with an amount of 1
              instructions.push(
                createTransferInstruction(
                  getAssociatedTokenAddressSync(mintPk, params.user),
                  destination,
                  params.user,
                  1
                ),
                createCloseAccountInstruction(
                  source,
                  useAccount(PixelGuildAccount.DRAIN),
                  params.user
                )
              );

              return instructions;
            })
          );

          instructions.push(...transferInstructions);
        } else {
          throw "Expected creators field for input.transfer";
        }
        break;
      default:
        throw `Unknown method: ${input.method}`;
    }
  }

  const transaction = new Transaction();

  transaction.feePayer = params.user;
  transaction.recentBlockhash = params.blockHash;

  transaction.add(...instructions);

  return transaction;
}
