import {
  ILootBoxConfig,
  LootBoxConfig,
  LootBoxDefinitions,
  LootBoxKey,
} from "@common/types/LootBoxConfig";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { cluster } from "@common/utils/web3/getConnection";
import { cloneDeep, isNil } from "lodash";
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

  {
    key: LootBoxKey.WIZARD_CHEST,
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
        token: useAccount(PixelGuildAccount.LOOT_CHEST_WIZARD).toString(),
        method: "burn" as const,
        amount: 1,
      },
    ],
    rewards: [
      {
        weight: 1,
        reward: {
          type: "edition" as const,
          masterEdition: useAccount(
            PixelGuildAccount.CHARACTER_MASTER_EDITION_YAGA
          ).toString(),
        },
      },
      {
        weight: 1,
        reward: {
          type: "edition" as const,
          masterEdition: useAccount(
            PixelGuildAccount.CHARACTER_MASTER_EDITION_GORC
          ).toString(),
        },
      },
      {
        weight: 1,
        reward: {
          type: "edition" as const,
          masterEdition: useAccount(
            PixelGuildAccount.CHARACTER_MASTER_EDITION_KENNY
          ).toString(),
        },
      },
      {
        weight: 1,
        reward: {
          type: "edition" as const,
          masterEdition: useAccount(
            PixelGuildAccount.CHARACTER_MASTER_EDITION_LILA
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
