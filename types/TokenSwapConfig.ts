export enum TokenSwapConfigKey {
  // PIXEL_FOR_GOLDEN_CHEST = "PIXEL_FOR_GOLDEN_CHEST",
  PIXEL_FOR_WIZARD_CHEST = "PIXEL_FOR_WIZARD_CHEST",
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
