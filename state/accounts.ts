import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import {
  definePixelGuildAccounts,
  definePixelGuildAccountsWithDefaults,
} from "@common/utils/definePixelGuildAccounts";
import { cluster } from "@common/utils/web3/getConnection";
import { PublicKey } from "@solana/web3.js";

/**
 * Define Mainnet accounts as variables
 */
export const MainnetAccounts = definePixelGuildAccounts({
  AUTHORITY: new PublicKey("BcFfivrRBDk7Sbobif1vLcpXwKiHsQHHaBgsbZ9QEsaX"),

  // TODO: REPLACE (REVIEW ALL TOKENS)
  DRAIN: new PublicKey("HCQLqRGPZTaPpSo5hw5ipcZDH3TSYYYBNyKJhimLvM57"),

  PIXEL: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"),
  GOLD: new PublicKey("BsYZmmEXPVPA31aax5pawZtYppoGiowPckxTcituaUCY"),
  GOLDEN_KEY_NFT_CREATOR: new PublicKey(
    "9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"
  ),
  GOLDEN_KEY: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"),
  LOOT_CHEST_GOLDEN: new PublicKey(
    "Ffv5ty4k1Esbw3FUhj6v6amscFTozD6gbJCvAqombxfo"
  ),

  CHARACTER_MASTER_EDITION_GOLDEN_BABA: new PublicKey(
    "3HkzdLidV7NEi9zZETMwKEDKxCfNZCJC3ZVekEGgCAS9"
  ),
});

/**
 * Override accounts on devnet
 */
export const DevnetAccounts = definePixelGuildAccountsWithDefaults(
  MainnetAccounts,
  {
    AUTHORITY: new PublicKey("BdcKeLk54HCB2n1v8v7iG2NpFrxjbpoXi9qXta23ALHM"),

    DRAIN: new PublicKey("HCQLqRGPZTaPpSo5hw5ipcZDH3TSYYYBNyKJhimLvM57"),

    PIXEL: new PublicKey("8XcGFqZiNFKhGbkRTvY84mAyMJkjChQkczuvx5UaMc9J"),
    GOLD: new PublicKey("DFkEanPARiN5mJ3PXQtJ9KqYLCGGYA7iH2ja9AwEPaut"),

    GOLDEN_KEY_NFT_CREATOR: new PublicKey(
      "BdcKeLk54HCB2n1v8v7iG2NpFrxjbpoXi9qXta23ALHM"
    ),

    GOLDEN_KEY: new PublicKey("8iiNnUaPdExGCF7V5aahKpM7KwzCykb8U8wBvAnnGPUV"),

    LOOT_CHEST_GOLDEN: new PublicKey(
      "Ffv5ty4k1Esbw3FUhj6v6amscFTozD6gbJCvAqombxfo"
    ),

    CHARACTER_MASTER_EDITION_GOLDEN_BABA: new PublicKey(
      "3HkzdLidV7NEi9zZETMwKEDKxCfNZCJC3ZVekEGgCAS9"
    ),
  }
);

export function useAccount(id: PixelGuildAccount) {
  switch (cluster) {
    case "devnet":
      return DevnetAccounts[id];
    default:
    case "mainnet-beta":
      return MainnetAccounts[id];
  }
}
