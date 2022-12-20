import { clamp, floor, isNil } from "lodash";

/**
 * The longest duration possible to earn a duration score
 */
const DURATION_CUTOFF = 600;

/**
 * This should probably change per level.
 */
const DURATION_WEIGHT = 500;

/**
 * This function calculates an aggregate score value from game results.
 * Set duration as null, to evaluate a score when the player has lost.
 *
 * @param coins
 * @param duration
 */
export function getScore(coins: number, duration: number | null | undefined) {
  if (isNil(duration)) {
    return { score: coins, coinScore: coins, durationScore: 0 };
  }

  // DURATION SCORE

  const x = 1 - clamp(duration / 1000, 0, DURATION_CUTOFF) / DURATION_CUTOFF;
  const x2 = Math.pow(x, 2);
  const durationScore = Math.floor(DURATION_WEIGHT * x2);

  // COIN SCORE

  const coinScore = coins;

  const score = durationScore + coinScore;

  return { score, durationScore, coinScore };
}
