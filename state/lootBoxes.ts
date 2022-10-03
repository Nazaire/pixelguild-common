import {
  ILootBoxConfig,
  LootBoxDefinitions,
  LootBoxKey,
} from "@common/types/LootBoxConfig";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { cloneDeep } from "lodash";
import { useAccount } from "./accounts";

const LootBoxDefinitions: ILootBoxConfig[] = [
  {
    key: LootBoxKey.GOLDEN_CHEST_1,
    inputs: [
      {
        // GOLDEN KEY
        creator: useAccount(
          PixelGuildAccount.GOLDEN_KEY_NFT_CREATOR
        ).toString(),
        method: "transfer",
        amount: 1,
      },
      {
        token: useAccount(PixelGuildAccount.LOOT_CHEST_GOLDEN).toString(),
        method: "burn",
        amount: 1,
      },
    ],
    rewards: [
      {
        weight: 10,
        reward: {
          type: "edition",
          masterEdition: useAccount(
            PixelGuildAccount.CHARACTER_MASTER_EDITION_GOLDEN_BABA
          ).toString(),
        },
      },
      {
        weight: 90,
        reward: {
          type: "mint",
          token: useAccount(PixelGuildAccount.GOLD).toString(),
          amount: 100,
        },
      },
    ],
  },
  {
    key: LootBoxKey.GOLDEN_CHEST_GUARANTEED,
    inputs: [
      {
        // GOLDEN KEY
        creator: useAccount(
          PixelGuildAccount.GOLDEN_KEY_NFT_CREATOR
        ).toString(),
        method: "transfer",
        amount: 10,
      },
      {
        token: useAccount(PixelGuildAccount.LOOT_CHEST_GOLDEN).toString(),
        method: "burn",
        amount: 1,
      },
    ],
    rewards: [
      {
        weight: 1,
        reward: {
          type: "edition",
          masterEdition: useAccount(
            PixelGuildAccount.CHARACTER_MASTER_EDITION_GOLDEN_BABA
          ).toString(),
        },
      },
    ],
  },
];

export function getLootBoxConfigByKey(key: string) {
  return cloneDeep(LootBoxDefinitions.find((c) => c.key === key));
}

export function getLootBoxRewardOption(key: string, reward: number) {
  const config = getLootBoxConfigByKey(key);
  if (!config) return null;
  return config.rewards[reward].reward;
}

export function getLootBoxConfigs() {
  return cloneDeep(LootBoxDefinitions);
}
