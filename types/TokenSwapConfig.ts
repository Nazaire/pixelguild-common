import { useAccount } from "@common/state/accounts";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { cloneDeep } from "lodash";

export enum TokenSwapConfigKey {
  PIXEL_FOR_GOLDEN_CHEST = "PIXEL_FOR_GOLDEN_CHEST",
}

export interface ITokenSwapInput {
  token: string;

  type: "burn" | "transfer";

  destination?: string;

  amount: number;
}

export interface ITokenSwapOutput {
  token: string;
  // todo: support creator
  source: {
    /**
     * mint will mint new supply, pool will transfer until none are remaining
     */
    type: "mint" | "pool";
    /**
     * The authority that can mint or transfer for the pool
     */
    authority: string;
  };
  amount: number;
}

export interface ITokenSwapConfig {
  key: string;
  input: ITokenSwapInput;
  output: ITokenSwapOutput;
}

const TokenSwapConfigs: ITokenSwapConfig[] = [
  {
    key: TokenSwapConfigKey.PIXEL_FOR_GOLDEN_CHEST,
    input: {
      token: useAccount(PixelGuildAccount.PIXEL).toString(),
      amount: 1e6,
      type: "transfer",
      destination: useAccount(PixelGuildAccount.DRAIN).toString(),
    },
    output: {
      token: useAccount(PixelGuildAccount.LOOT_CHEST_GOLDEN).toString(),
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

  if (!match) throw `Config not found with key: ${key}`;

  return cloneDeep(match);
}
