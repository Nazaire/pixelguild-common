import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import {
  ITokenSwapConfig,
  TokenSwapConfigKey,
} from "@common/types/TokenSwapConfig";
import { cluster } from "@common/utils/web3/getConnection";
import { cloneDeep } from "lodash";
import { useAccount } from "./accounts";

const TokenSwapConfigs: ITokenSwapConfig[] = [
  {
    key: TokenSwapConfigKey.PIXEL_FOR_WIZARD_CHEST,
    input: {
      token: useAccount(PixelGuildAccount.PIXEL).toString(),
      amount: 60e6,
      type: "transfer",
      destination: useAccount(PixelGuildAccount.DRAIN).toString(),
    },
    output: {
      token: useAccount(PixelGuildAccount.LOOT_CHEST_WIZARD).toString(),
      amount: 1,
      source: {
        type: "mint",
        authority: useAccount(PixelGuildAccount.AUTHORITY).toString(),
      },
    },
  },
];

export function getTokenSwapConfigs() {
  return cloneDeep(TokenSwapConfigs);
}

export function getTokenSwapConfigByKey(key: string) {
  const match = TokenSwapConfigs.find((config) => config.key === key);

  if (!match) {
    console.warn(`Config not found with key: ${key}`);
    return null as never;
  }

  return cloneDeep(match);
}
