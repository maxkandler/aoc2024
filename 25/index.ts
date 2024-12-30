import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf8").split("\n");

const keys: number[][] = [];
const locks: number[][] = [];

const getPins = (lines: string[]) => {
  const pins = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      pins[j] = (pins[j] ?? 0) + (lines[i][j] === "#" ? 1 : 0);
    }
  }
  return pins;
};

for (let i = 0; i < input.length; i++) {
  if (input[i] === "") {
    continue;
  }

  if (input[i] === "#####") {
    locks.push(getPins(input.slice(i + 1, i + 6)));
    i += 6;
    continue;
  }

  if (input[i + 6] === "#####") {
    keys.push(getPins(input.slice(i, i + 6)));
    i += 6;
    continue;
  }
}

const keyFits = (key: number[], lock: number[]) => {
  for (let i = 0; i < key.length; i++) {
    if (key[i] + lock[i] > 5) {
      return false;
    }
  }
  return true;
};

let lockMatches = 0;

for (const lock of locks) {
  for (const key of keys) {
    if (keyFits(key, lock)) {
      lockMatches++;
    }
  }
}

console.log(lockMatches);
