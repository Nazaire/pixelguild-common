import { promiseSequence } from "@common/utils/promiseSequence";
import { trimNull } from "@common/utils/trimNull";
import {
  Account,
  findMasterEditionV2Pda,
  findMetadataPda,
  parseOriginalOrPrintEditionAccount,
  toMetadataAccount,
} from "@metaplex-foundation/js";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import axios from "axios";
import DataLoader from "dataloader";
import { chunk, find, flatMap, isNil, zip } from "lodash";
import { createAccountsRepo } from "./createAccountsRepo";
import { getConnection } from "./getConnection";
import { IMetaplexToken, MetaplexToken } from "./types/MetaplexToken";

// CHECK: Max batch size of this function?

/**
 * Batch load NFTs
 */

export function createMetaplexTokenRepo(
  accountsRepo: DataLoader<
    string,
    AccountInfo<Buffer> | null
  > = createAccountsRepo()
) {
  const loader = new DataLoader<string, MetaplexToken | null>(async (mints) => {
    // console.log(`Loading ${mints.length} metaplex tokens...`, {
    //   mints,
    // });

    const tokens: {
      id: string;
      mint: PublicKey;
      metadata: PublicKey;
      edition: PublicKey;
      token: Partial<IMetaplexToken>;
    }[] = mints.map((mint) => ({
      id: mint.toString(),
      mint: new PublicKey(mint),
      metadata: findMetadataPda(new PublicKey(mint)),
      edition: findMasterEditionV2Pda(new PublicKey(mint)),
      token: {
        id: mint,
        mintAddress: new PublicKey(mint),
      },
    }));

    const accounts = flatMap(
      tokens.map((token) => [
        // token.accounts!.mint,
        token.metadata,
        token.edition,
      ])
    );

    const accountsWithInfo = zip(
      accounts,
      await accountsRepo.loadMany(accounts.map((a) => a.toString()))
    );

    /**
     * Parse all the accounts and store with the token
     */
    for (const account of accountsWithInfo) {
      for (const token of tokens) {
        // if (token.accounts!.mint!.equals(account[0]!)) {
        //   if (account[1]) {
        //     const parsed = toMintAccount(account[1] as Account<Buffer>);
        //     // console.log(`Mint account`, { account, token, parsed });
        //     token.mint = parsed.data;
        //   } else {
        //     token.mint = null;
        //   }
        // }
        if (token.metadata!.equals(account[0]!)) {
          if (account[1]) {
            const parsed = toMetadataAccount(account[1] as Account<Buffer>);
            // console.log(`Metadata account`, { account, token, parsed });
            token.token.metadata = parsed.data;
          } else {
            token.token.metadata = null;
          }
        } else if (token.edition!.equals(account[0]!)) {
          if (account[1]) {
            const parsed = parseOriginalOrPrintEditionAccount(
              account[1] as Account<Buffer>
            );
            // console.log(`Edition account`, { account, token, parsed });
            token.token.edition = parsed.data;
          } else {
            token.token.edition = null;
          }
        }
      }
    }

    /**
     * Load external metadata
     */
    await promiseSequence(
      chunk(
        tokens.filter((token) => !isNil(token.token.metadata?.data.uri)),
        20
      ).map(async (batch) => {
        const results = await Promise.all(
          batch.map(async (token) => {
            const uri = trimNull(token.token.metadata!.data.uri);
            console.log(`Loading ${JSON.stringify(uri)}...`);
            try {
              const response = await axios.get(uri);
              return { id: token.id, data: response.data, error: null };
            } catch (error) {
              return { id: token.id, data: null, error };
            }
          })
        );

        for (const result of results) {
          const token = find(tokens, (token) => token.id === result.id)!;
          token.token.externalMetadata = result.data;
        }
      })
    );

    // console.log(`Loaded ${tokens.length} metaplex tokens`, { tokens });

    return tokens.map((token) =>
      token.metadata !== null
        ? new MetaplexToken(token.token as IMetaplexToken)
        : null
    );
  });

  return loader;
}

export type MetaplexTokenRepo = ReturnType<typeof createMetaplexTokenRepo>;
