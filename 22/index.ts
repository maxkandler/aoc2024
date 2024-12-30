import { readFileSync } from "node:fs";

const numberInput = readFileSync("input.txt", "utf8")
  .split("\n")
  .map((line) => BigInt(line));

const mix = (secret: bigint, value: bigint): bigint => {
  return value ^ secret;
};

const prune = (secret: bigint): bigint => {
  return secret % 16777216n;
};

const generateNextNumber = (secret: bigint): bigint => {
  let currentSecret = prune(mix(secret, secret * 64n));
  currentSecret = mix(
    currentSecret,
    BigInt(Math.floor(Number(currentSecret / 32n)))
  );
  currentSecret = prune(mix(currentSecret, currentSecret * 2048n));
  return currentSecret;
};

const ChangeCache = new Map<string, number>();

let total = 0n;
for (const number of numberInput) {
  let secret = number;
  let iterations = 2000;

  let prev0, prev1, prev2, prev3, previousPrice: number | undefined;
  const changePatterns: string[] = [];

  for (let i = 0; i < iterations; i++) {
    secret = generateNextNumber(secret);
    const price = Number(secret) % 10;
    prev3 = prev2;
    prev2 = prev1;
    prev1 = prev0;
    prev0 = price - (previousPrice ?? 0);
    previousPrice = price;

    if (prev3 !== undefined) {
      const cacheKey = [prev3, prev2, prev1, prev0].join(",");
      if (!changePatterns.includes(cacheKey)) {
        ChangeCache.set(cacheKey, (ChangeCache.get(cacheKey) ?? 0) + price);
        changePatterns.push(cacheKey);
      }
    }
  }
  total += secret;
}
console.log({ partA: total, partB: Math.max(...[...ChangeCache.values()]) });
