import { clamp, floor } from "lodash";

export class GuildieGoldEquations {
  static readonly STACKING_MULTIPLIER_RANGE = [3, 5];
  static readonly RARITY_MULTIPLIER_RANGE = [2, 5];

  static stackingMultiplier(quantity: number) {
    const x = clamp(quantity, 0, 10);

    if (x === 0) return 0;

    // y = 0.002154 * x^3 - 0.03578 * x^2 + 0.2098 * x + 1.558
    const y =
      0.002154 * Math.pow(x, 3) -
      0.035578 * Math.pow(x, 2) +
      0.2098 * x +
      1.558;

    const Y =
      (this.STACKING_MULTIPLIER_RANGE[1] - this.STACKING_MULTIPLIER_RANGE[0]) *
        y +
      this.STACKING_MULTIPLIER_RANGE[0];

    return floor(Y, 2);
  }

  static rarityMultiplier(rank: number) {
    const x = clamp(rank, 0, 2222);

    const y =
      -1.433e-10 * Math.pow(x, 3) +
      4.74e-7 * Math.pow(x, 2) -
      0.0005698 * x +
      2.232;

    const Y =
      (this.RARITY_MULTIPLIER_RANGE[1] - this.RARITY_MULTIPLIER_RANGE[0]) * y +
      this.RARITY_MULTIPLIER_RANGE[0];

    return floor(Y, 2);
  }
}
