import {
  ILootBoxRewardOption,
  LootBoxConfig,
  LootBoxDefinitions,
  LootBoxId,
  LootBoxTokenRewardType,
} from "@common/types/LootBoxConfig";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import { cluster } from "@common/utils/web3/getConnection";
import { cloneDeep } from "lodash";
import { useAccount } from "./accounts";

export const LOOTBOX_REWARD_A: ILootBoxRewardOption = {
  rewardType: LootBoxTokenRewardType.NFT,
  uri: "https://test.co",
};

const LootBoxDefinitions: LootBoxDefinitions = {
  [LootBoxId.BAKER_BABA]: {
    id: LootBoxId.BAKER_BABA,
    inputs: [
      {
        // GOLDEN KEY
        mint: useAccount(PixelGuildAccount.GOLDEN_KEY).toString(),
        method: "burn",
        amount: 1,
      },
      {
        // BAKER BABA LOOTBOX
        mint:
          cluster === "mainnet-beta"
            ? ""
            : "9KwqMGk5sF4hqCiqM4na9u2bieZjcjkxwxYiF2bne6DS",
        method: "burn",
        amount: 1,
      },
    ],
    rewards: [
      {
        weight: 1,
        reward: LOOTBOX_REWARD_A,
      },
    ],
  },
};

export function getLootBoxConfig(id: LootBoxId) {
  return new LootBoxConfig(cloneDeep(LootBoxDefinitions[id]));
}

export function getLootBoxConfigs() {
  return cloneDeep(
    Object.values(LootBoxConfig).map((c) => new LootBoxConfig(c))
  );
}
