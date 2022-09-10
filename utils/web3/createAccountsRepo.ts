import { promiseSequence } from "@common/utils/promiseSequence";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import DataLoader from "dataloader";
import { chunk, flatMap, zip } from "lodash";
import { getConnection } from "./getConnection";

export function createAccountsRepo(
  connection: Connection = getConnection("confirmed"),
  options?: {
    choke?: (tokens: number) => Promise<any>;
  }
) {
  const loader = new DataLoader<
    string,
    (AccountInfo<Buffer> & { publicKey: PublicKey }) | null
  >(async (accounts) => {
    // console.log(`Loading ${accounts.length} accounts...`);

    /**
     * Fetch mint, metadata and edition accounts
     */
    if (options?.choke) await options.choke(1);
    const accountsWithInfo = flatMap(
      await promiseSequence(
        chunk(accounts, 100).map(async (accounts) => {
          const results = await connection.getMultipleAccountsInfo(
            accounts.map((account) => new PublicKey(account))
          );

          return zip(accounts, results);
        })
      )
    );

    // console.log(`Loaded ${accounts.length} accounts`);

    return accountsWithInfo.map(([address, account]) => {
      if (!account) return null;
      return {
        publicKey: new PublicKey(address!),
        ...account,
      };
    });
  });

  return loader;
}

export type AccountsRepo = ReturnType<typeof createAccountsRepo>;