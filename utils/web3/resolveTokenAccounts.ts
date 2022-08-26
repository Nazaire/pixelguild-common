import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { reduce } from "lodash";

export async function resolveTokenAccounts(
  owner: PublicKey,
  mints: PublicKey[]
): Promise<Record<string, PublicKey>> {
  const resolved = await Promise.all(
    mints.map(async (mint) => {
      const tokenAccount = await getAssociatedTokenAddress(mint, owner);

      return {
        mint,
        tokenAccount,
      };
    })
  );

  return reduce(
    resolved,
    (map, accounts) => {
      map[accounts.mint.toString()] = accounts.tokenAccount;
      return map;
    },
    {} as Record<string, PublicKey>
  );
}
