import {
  Account,
  parseMintAccount,
  parseTokenAccount,
} from "@metaplex-foundation/js";
import DataLoader from "dataloader";
import { find, isNil } from "lodash";
import { AccountsRepo, createAccountsRepo } from "./createAccountsRepo";
import { TokenAccount } from "./types/TokenAccount";

export function createTokenAccountRepo(
  accountsRepo: AccountsRepo = createAccountsRepo()
) {
  const loader = new DataLoader<string, TokenAccount | null>(
    async (tokenAccounts) => {
      // console.log(`Loading ${tokenAccounts.length} token accounts...`);

      const accounts = await accountsRepo.loadMany(tokenAccounts);
      const parsed = accounts.map((account) =>
        account ? parseTokenAccount(account as Account<Buffer>) : account
      );
      const mintAccounts = await accountsRepo.loadMany(
        parsed
          .filter((account) => !isNil(account?.data.mint))
          .map((account) => account!.data.mint.toString())
      );

      const tokenAccountDatas = parsed.map((account) => {
        if (account) {
          const mintAccount = find(mintAccounts, (mint) => {
            if (!mint) return false;
            if (mint instanceof Error) return false;
            return account.data.mint.equals(mint.publicKey);
          });

          if (!mintAccount) return null;

          const parsed = parseMintAccount(mintAccount as Account<Buffer>);

          return new TokenAccount({
            id: account.publicKey.toString()!,
            publicKey: account.publicKey,
            // accounts: { token: account.publicKey, mint: account.data.mint },
            account: account.data,
            mint: parsed.data,
          });
        } else {
          return null;
        }
      });

      return tokenAccountDatas;
    }
  );

  return loader;
}
