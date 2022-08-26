import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { PublicKey } from "@solana/web3.js";
import { defaults } from "lodash";

export function definePixelGuildAccounts(
  accounts: Record<PixelGuildAccount, PublicKey>
) {
  return accounts;
}

export function definePixelGuildAccountsWithDefaults(
  defaultAccounts: Record<PixelGuildAccount, PublicKey>,
  overrides: Partial<Record<PixelGuildAccount, PublicKey>>
) {
  return defaults(overrides, defaultAccounts);
}
