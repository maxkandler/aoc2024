import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf8").split("\n");

const NumPad = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  [null, 0, "A"],
];

const DirectionalPad = [
  [null, "^", "A"],
  ["<", "v", ">"],
];

const findPosition = (
  pad: any[][],
  target: string | number
): { x: number; y: number } | undefined => {
  for (let y = 0; y < pad.length; y++) {
    for (let x = 0; x < pad[y].length; x++) {
      if (pad[y][x] == target) {
        return { x, y };
      }
    }
  }
  return undefined;
};

const createPermutations = (str: string): string[] => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split("")
    .reduce<string[]>(
      (acc, letter, i) =>
        acc.concat(
          createPermutations(str.slice(0, i) + str.slice(i + 1)).map(
            (val) => letter + val
          )
        ),
      []
    );
};

const getNumPadOptions = (
  currentField: string | number,
  nextField: string | number
): string[] => {
  const currentPos = findPosition(NumPad, currentField);

  const nextPos = findPosition(NumPad, nextField);
  if (!nextPos || !currentPos) return [];

  const moves = {
    y: nextPos.y - currentPos.y,
    x: nextPos.x - currentPos.x,
  };

  let instructions: string = "";

  if (moves.x < 0) {
    instructions = instructions.concat(
      Array(Math.abs(moves.x)).fill("<").join("")
    );
    moves.x = 0;
  }
  if (moves.x > 0) {
    instructions = instructions.concat(
      Array(Math.abs(moves.x)).fill(">").join("")
    );
    moves.x = 0;
  }
  if (moves.y < 0) {
    instructions = instructions.concat(
      Array(Math.abs(moves.y)).fill("^").join("")
    );
    moves.y = 0;
  }
  if (moves.y > 0) {
    instructions = instructions.concat(
      Array(Math.abs(moves.y)).fill("v").join("")
    );
    moves.y = 0;
  }

  const permutations = createPermutations(instructions);

  const validPermutations: string[] = [];

  for (const permutation of new Set(permutations).values()) {
    let tempPos = { x: currentPos.x, y: currentPos.y };

    let isValid = true;
    for (const move of permutation.split("")) {
      if (move === "^") {
        if (NumPad[tempPos.y - 1][tempPos.x] === null) {
          isValid = false;
          break;
        }
        tempPos.y = tempPos.y - 1;
      }

      if (move === "v") {
        if (NumPad[tempPos.y + 1][tempPos.x] === null) {
          isValid = false;
          break;
        }
        tempPos.y = tempPos.y + 1;
      }

      if (move === ">") {
        if (NumPad[tempPos.y][tempPos.x + 1] === null) {
          isValid = false;
          break;
        }
        tempPos.x = tempPos.x + 1;
      }

      if (move === "<") {
        if (NumPad[tempPos.y][tempPos.x - 1] === null) {
          isValid = false;
          break;
        }
        tempPos.x = tempPos.x - 1;
      }
    }
    if (!isValid) continue;
    validPermutations.push(`${permutation}A`);
  }

  return validPermutations;
};

const PAD_STEPS = {
  "^-v": "vA",
  "^-<": "v<A",
  "^->": "v>A",
  "^-A": ">A",

  "v-^": "^A",
  "v-<": "<A",
  "v->": ">A",
  "v-A": "^>A",

  "<-^": ">^A",
  "<-v": ">A",
  "<->": ">>A",
  "<-A": ">>^A",

  ">-^": "<^A",
  ">-v": "<A",
  ">-<": "<<A",
  ">-A": "^A",

  "A-^": "<A",
  "A-v": "<vA",
  "A-<": "v<<A",
  "A->": "vA",
};

const getPadSteps = (from: string | number, to: string | number): string => {
  if (from === to) return "A";
  return PAD_STEPS[`${from}-${to}`];
};

const INST_CACHE: Record<string, { count: bigint; lastKey: string }> = {};

const getInstructions = (keys: string, levels: number): bigint => {
  if (levels === 0) {
    return BigInt(keys.length);
  }
  let countOnLevel = 0n;

  const parts = keys.split("A");
  let from = "A";

  for (const [key, part] of parts.entries()) {
    const fullKey = `${part}${key === parts.length - 1 ? "" : "A"}`;

    if (INST_CACHE[`${fullKey}-${levels}`]) {
      countOnLevel += INST_CACHE[`${fullKey}-${levels}`].count;
      from = INST_CACHE[`${fullKey}-${levels}`].lastKey;
      continue;
    }

    let countForKey = 0n;

    for (const to of fullKey) {
      const nextSteps = getPadSteps(from, to);
      countForKey += getInstructions(nextSteps, levels - 1);
      from = to;
    }
    INST_CACHE[`${fullKey}-${levels}`] = {
      count: countForKey,
      lastKey: from,
    };

    countOnLevel += countForKey;
  }

  return countOnLevel;
};

const getNumberInstructionOptions = (
  keys: Array<string | number>
): string[][] => {
  const instructions: string[][] = [];
  let lastField: string | number = "A";
  for (const key of keys) {
    const nextStep = getNumPadOptions(lastField, key);
    instructions.push(nextStep);
    lastField = key;
  }
  return instructions;
};

const iterateLevels = (options: string[][], levels: number): bigint => {
  let shortestInstructions = 0n;

  for (const part of options) {
    let shortestOption = 0n;
    for (const option of part) {
      const countForOption = getInstructions(option, levels);
      if (countForOption <= shortestOption || shortestOption === 0n) {
        shortestOption = countForOption;
      }
    }

    shortestInstructions += shortestOption;
  }
  return shortestInstructions;
};

let totalA = 0n;
let totalB = 0n;

for (const number of input) {
  const instructionOptionParts = getNumberInstructionOptions(number.split(""));

  const shortestInstructionsA = iterateLevels(instructionOptionParts, 2);
  const lengthA = shortestInstructionsA;

  const shortestInstructionsB = iterateLevels(instructionOptionParts, 25);
  const lengthB = shortestInstructionsB;

  const numberPart = Number(number.match(/[1-9][0-9]+/)[0]);

  totalA += BigInt(lengthA) * BigInt(numberPart);
  totalB += BigInt(lengthB) * BigInt(numberPart);
}

console.log({ totalA, totalB });
