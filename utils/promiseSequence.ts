export async function promiseSequence<T>(promises: Promise<T>[]) {
  const results = [] as T[];
  for (const p of promises) {
    results.push(await p);
  }
  return results;
}
