import { clamp, floor } from "lodash";

export class GuildieGoldEquations {
  static stackingMultiplier(quantity: number) {
    // y = 0.002154 * x^3 - 0.03578 * x^2 + 0.2098 * x + 1.558
    const x = clamp(quantity, 0, 10);

    if (x === 0) return 0;

    const y =
      0.002154 * Math.pow(x, 3) -
      0.035578 * Math.pow(x, 2) +
      0.2098 * x +
      1.558;

    return floor(y, 2);
  }

  static rarityMultiplier(rank: number) {
    const x = clamp(rank, 0, 2222);

    const y =
      -1.433e-10 * Math.pow(x, 3) +
      4.74e-7 * Math.pow(x, 2) -
      0.0005698 * x +
      2.232;

    return floor(y, 2);
  }
}
