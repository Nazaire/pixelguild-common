import { TokenBucket } from "limiter";
import { clamp } from "lodash";

export function createThrottle(tokensPerSecond: number, bucketSize = 1) {
  const bucket = new TokenBucket({
    bucketSize,
    tokensPerInterval: tokensPerSecond,
    interval: "second",
  });

  const consume = (tokens: number) => bucket.removeTokens(tokens);

  return {
    consume,
    bucket,
  };
}
