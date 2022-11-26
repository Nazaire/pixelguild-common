import { clamp, floor } from "lodash";

/**
 * Based on average stats 1 coin adds 2 seconds to the score.
 *
 * Couple of examples:
 *
 * 100 COINS @ 400 S = 120
 * 100 COINS @ 300 S = 220
 *
 *
 * @param coins
 * @param duration
 */
export function getScore(coins: number, duration: number) {
  /**
   * 1 point for every second off 7 minutes
   */
  const x = 1 - clamp(duration / 1000, 0, 420) / 420;
  const x2 = Math.pow(x, 2);
  const durationScore = Math.floor(420 * x2);

  console.log({ duration, x, durationScore });
  /**
   * 1 point for each coin
   */
  const coinScore = coins;

  return durationScore + coinScore;
}
