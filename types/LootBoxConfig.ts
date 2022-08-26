import { reduce } from "lodash";

export enum LootBoxId {
  BAKER_BABA = "BAKER_BABA",
}

export interface ILootBoxInput {
  mint?: string;
  creator?: string;

  amount: number;

  method: "burn" | "transfer";
}
export type ILootBoxTombola = [
  {
    weight: number;
    reward: ILootBoxRewardOption;
  }
];

export interface ILootBoxConfig {
  id: LootBoxId;
  inputs: ILootBoxInput[];
  rewards: ILootBoxTombola;
}

export class LootBoxConfig implements ILootBoxConfig {
  id!: LootBoxId;
  inputs!: ILootBoxInput[];
  rewards!: ILootBoxTombola;

  constructor(config: ILootBoxConfig) {
    this.id = config.id;
    this.inputs = config.inputs;
    this.rewards = config.rewards;
  }

  get tombolaWeight() {
    return reduce(
      this.rewards,
      (total, reward) => {
        return total + reward.weight;
      },
      0
    );
  }

  probability(index: number) {
    return this.rewards[index].weight / this.tombolaWeight;
  }
}

export type LootBoxDefinitions = Record<LootBoxId, ILootBoxConfig>;

// REWARD TYPES

export enum LootBoxTokenRewardType {
  NFT = "NFT",
  TOKENS = "TOKENS",
}

export interface ILootBoxTokenRewardOption {
  rewardType: LootBoxTokenRewardType.TOKENS;
  mint: string;
  amount: number;
}

export interface ILootBoxNftRewardOption {
  rewardType: LootBoxTokenRewardType.NFT;
  uri: string;
}

export type ILootBoxRewardOption =
  | ILootBoxTokenRewardOption
  | ILootBoxNftRewardOption;
