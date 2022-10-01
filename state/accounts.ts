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
  DRAIN: new PublicKey("HSpJeobZxS3gEeGuJD1ggB8WNmdokASJf27TL5w6giGC"),

  PIXEL: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"), // todo: mainnet
  GOLD: new PublicKey("BsYZmmEXPVPA31aax5pawZtYppoGiowPckxTcituaUCY"),

  ITEMS_COLLECTION: new PublicKey(
    "28Wkb7Ai9cTDaKFhVSxwcNBjvtcU6EBe6YEvn18ceaTY"
  ),

  GOLDEN_KEY_NFT_CREATOR: new PublicKey(
    "sFgDh7LbMUkjnXDy1ViYyTmizFKw9P4bPRHx2UaUt4F"
  ),
  GOLDEN_KEY: new PublicKey("9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS"), // todo: mainnet
  LOOT_CHEST_GOLDEN: new PublicKey(
    "HnXoSyPPJWMRZz9foG963jFGAkT3T5BF6AFGaYz2hc8y"
  ),

  CHARACTER_MASTER_EDITION_GOLDEN_BABA: new PublicKey(
    "5JuCjAAxpeyTbv6b9tp9hwim1spWxuGq6Zno1WGqMRGv"
  ),
  CHARACTER_MASTER_EDITION_YAGA: new PublicKey(
    "ARNSvrhppiS6znDQjaTEAZGrwjP1n6mh2uebGwjxPYB3"
  ),
  CHARACTER_MASTER_EDITION_GORC: new PublicKey(
    "5VdqHD5Ja2XBjHuFzXLSf1J5N67HX3QCvrxzADJMxJ5"
  ),
  CHARACTER_MASTER_EDITION_KENNY: new PublicKey(
    "GZQiw8QBuoM4AxaP78NxgWpRNB5kZTRUQmsekJy7RpFs"
  ),
  CHARACTER_MASTER_EDITION_LILA: new PublicKey(
    "FYCUDKyFEy8wEZ2iCEaunojKLV8K45gAmnArjEGcAjHd"
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

    ITEMS_COLLECTION: new PublicKey(
      "25D9qsLuyPQYnzFcuveD2U3u4cyaCEprYj8bfDH3q9YH"
    ),

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
    CHARACTER_MASTER_EDITION_YAGA: new PublicKey(
      "37y51by5cBcWq1XaCCccTquQMkHva1NJ5WG7kNrJpmhv"
    ),
    CHARACTER_MASTER_EDITION_GORC: new PublicKey(
      "4jobnuCEeFXPt1WCezM8rqzgEDyRhwxCAJtmASD7s5cG"
    ),
    CHARACTER_MASTER_EDITION_KENNY: new PublicKey(
      "HWwGnn1M39RN31HTj34T9wkJyUBmp1TXAPho5ZhqX7DQ"
    ),
    CHARACTER_MASTER_EDITION_LILA: new PublicKey(
      "Ek2BVbegCiiwQFkgkGBnmHJ22DNCr9SPrk4LU7KKN9rU"
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
