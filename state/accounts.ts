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
  PIXEL: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"),
  GOLD: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"),
  GOLDEN_KEY_NFT_CREATOR: new PublicKey(
    "9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"
  ),
  GOLDEN_KEY: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"),
});

/**
 * Override accounts on devnet
 */
export const DevnetAccounts = definePixelGuildAccountsWithDefaults(
  MainnetAccounts,
  {
    PIXEL: new PublicKey("DnB27AtrQzmsCzb26AZwktrQiGG9bBkyhzs1rVrKvHAo"),
    GOLD: new PublicKey("DFkEanPARiN5mJ3PXQtJ9KqYLCGGYA7iH2ja9AwEPaut"),
    GOLDEN_KEY_NFT_CREATOR: new PublicKey(
      "9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"
    ),
    GOLDEN_KEY: new PublicKey("8iiNnUaPdExGCF7V5aahKpM7KwzCykb8U8wBvAnnGPUV"),
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
