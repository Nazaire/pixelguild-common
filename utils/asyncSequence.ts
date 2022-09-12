import { chunk } from "lodash";

export async function asyncSequence<T>(
  promises: (() => Promise<T>)[],
  options?: {
    concurrency?: number;
    onResult?: (
      results: T[],
      i: number,
      promises: (() => Promise<T>)[]
    ) => void;
  }
) {
  const results = [] as T[];
  let i = 0;
  for (const batch of chunk(promises, options?.concurrency || 1)) {
    const batchResults = await Promise.all(batch.map((p) => p()));
    if (options?.onResult) options.onResult(batchResults, i, promises);
    results.push(...batchResults);
    i += batchResults.length;
  }
  return results;
}
