import { clamp, floor } from "lodash";

export class GuildieGoldEquations {
  static readonly STACKING_MULTIPLIER_RANGE = [Math.sqrt(2), Math.sqrt(4)];
  static readonly RARITY_MULTIPLIER_RANGE = [Math.sqrt(2), Math.sqrt(4)];

  static stackingMultiplier(quantity: number) {
    if (quantity < 1) return 0;

    const x = clamp(quantity, 1, 10);

    // y = 0.004274 * x^3 - 0.07099 * x^2 + 0.4162 * x - 0.3458
    const y =
      0.004274 * Math.pow(x, 3) -
      0.07099 * Math.pow(x, 2) +
      0.4162 * x -
      0.3458;

    const Y =
      (this.STACKING_MULTIPLIER_RANGE[1] - this.STACKING_MULTIPLIER_RANGE[0]) *
        y +
      this.STACKING_MULTIPLIER_RANGE[0];

    // console.log({ Y, y, x, quantity });

    return floor(Y, 2);
  }

  static rarityMultiplier(rank: number) {
    const x = clamp(rank, 1, 2222);

    // y = -2.842e-10 * x^3 + 9.399e-7 * x^2 - 0.00113 * x + 0.9923
    const y =
      -2.842e-10 * Math.pow(x, 3) +
      9.399e-7 * Math.pow(x, 2) -
      0.00113 * x +
      0.9923;

    const Y =
      (this.RARITY_MULTIPLIER_RANGE[1] - this.RARITY_MULTIPLIER_RANGE[0]) * y +
      this.RARITY_MULTIPLIER_RANGE[0];

    // console.log({ Y, y, x, rank });

    return floor(Y, 2);
  }
}
