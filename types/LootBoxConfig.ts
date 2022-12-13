import { reduce } from "lodash";

export enum LootBoxKey {
  GOLDEN_CHEST_1 = "GOLDEN_CHEST_1",
  GOLDEN_CHEST_GUARANTEED = "GOLDEN_CHEST_GUARANTEED",
  WIZARD_CHEST = "WIZARD_CHEST",
}

export interface ILootBoxInput {
  token?: string;
  creator?: string;

  amount: number;

  method: "burn" | "transfer";
}
export type ILootBoxTombola = {
  weight: number;
  reward: ILootBoxRewardOption;
}[];

export interface ILootBoxConfig {
  key: LootBoxKey;
  inputs: ILootBoxInput[];
  rewards: ILootBoxTombola;
}

export class LootBoxConfig implements ILootBoxConfig {
  key!: LootBoxKey;
  inputs!: ILootBoxInput[];
  rewards!: ILootBoxTombola;

  totalTombolaWeight!: number;

  constructor(config: ILootBoxConfig) {
    this.key = config.key;
    this.inputs = config.inputs;
    this.rewards = config.rewards;

    this.totalTombolaWeight = reduce(
      this.rewards,
      (total, reward) => {
        return total + reward.weight;
      },
      0
    );
  }

  probability(index: number) {
    return this.rewards[index].weight / this.totalTombolaWeight;
  }
}

export type LootBoxDefinitions = Record<LootBoxKey, ILootBoxConfig>;

// REWARD TYPES

export interface ILootBoxEmptyReward {
  type: "empty";
}

export interface ILootBoxMintReward {
  type: "mint";

  token: string;

  amount: number;
}

/**
 * The transfer reward is only a potential reward while there is supply in the pool
 */
export interface ILootBoxTransferReward {
  type: "transfer";

  token: string;

  amount: number;
}

export interface ILootBoxEditionReward {
  type: "edition";

  masterEdition: string;
}

export type ILootBoxRewardOption =
  | ILootBoxEditionReward
  | ILootBoxMintReward
  | ILootBoxEmptyReward;
