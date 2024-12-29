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

const PAD_CACHE: Record<string, string> = {};

const getPadSteps = (
  currentField: string | number,
  nextField: string | number
): string => {
  if (PAD_CACHE[`${currentField}-${nextField}`]) {
    return PAD_CACHE[`${currentField}-${nextField}`];
  }

  const currentPos = findPosition(DirectionalPad, currentField);

  const nextPos = findPosition(DirectionalPad, nextField);
  if (!nextPos || !currentPos) return "";

  const moves = {
    y: nextPos.y - currentPos.y,
    x: nextPos.x - currentPos.x,
  };

  let instructions = "";

  let tempPos = { ...currentPos };

  while (moves.x !== 0 || moves.y !== 0) {
    if (
      instructions.at(-1) === "^" &&
      moves.y < 0 &&
      DirectionalPad[tempPos.y - 1][tempPos.x] !== null
    ) {
      instructions = instructions.concat("^");
      moves.y += 1;
      tempPos.y -= 1;
      continue;
    }
    if (
      instructions.at(-1) === ">" &&
      moves.x > 0 &&
      DirectionalPad[tempPos.y][tempPos.x + 1] !== null
    ) {
      instructions = instructions.concat(">");
      moves.x -= 1;
      tempPos.x += 1;
      continue;
    }
    if (
      instructions.at(-1) === "v" &&
      moves.y > 0 &&
      DirectionalPad[tempPos.y + 1][tempPos.x] !== null
    ) {
      instructions = instructions.concat("v");
      moves.y -= 1;
      tempPos.y += 1;
      continue;
    }
    if (
      instructions.at(-1) === "<" &&
      moves.x < 0 &&
      DirectionalPad[tempPos.y][tempPos.x - 1] !== null
    ) {
      instructions = instructions.concat("<");
      moves.x += 1;
      tempPos.x -= 1;
      continue;
    }

    if (moves.x > 0 && DirectionalPad[tempPos.y][tempPos.x + 1] !== null) {
      instructions = instructions.concat(">");
      moves.x -= 1;
      tempPos.x += 1;
      continue;
    }
    if (moves.y < 0 && DirectionalPad[tempPos.y - 1][tempPos.x] !== null) {
      instructions = instructions.concat("^");
      moves.y += 1;
      tempPos.y -= 1;
      continue;
    }
    if (moves.y > 0 && DirectionalPad[tempPos.y + 1][tempPos.x] !== null) {
      instructions = instructions.concat("v");
      moves.y -= 1;
      tempPos.y += 1;
      continue;
    }

    if (moves.x < 0 && DirectionalPad[tempPos.y][tempPos.x - 1] !== null) {
      instructions = instructions.concat("<");
      moves.x += 1;
      tempPos.x -= 1;
      continue;
    }
  }

  instructions = instructions.concat("A");

  PAD_CACHE[`${currentField}-${nextField}`] = instructions;

  return instructions;
};

const INST_CACHE: Record<string, string> = {};

const getInstructions = (keys: string): string => {
  let instructions = "";
  const parts = keys.split("A");
  let lastField: string | number = "A";

  for (const [key, part] of parts.entries()) {
    const fullKey = `${part}${key === parts.length - 1 ? "" : "A"}`;
    let partialInstructions = "";
    if (INST_CACHE[fullKey]) {
      // console.log("Cache hit", fullKey, INST_CACHE);
      instructions = instructions.concat(INST_CACHE[fullKey]);
      lastField = fullKey.at(-1)!;
      continue;
    }

    for (const key of fullKey) {
      const nextStep = getPadSteps(lastField, key);
      partialInstructions = partialInstructions.concat(nextStep);
      lastField = key;
    }

    INST_CACHE[fullKey] = partialInstructions;
    instructions = instructions.concat(partialInstructions);
  }

  return instructions;
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

const iterateLevels = (options: string[][], levels: number): string => {
  let shortestInstructions: string = "";

  for (const part of options) {
    let shortestOption: string = "";
    for (const option of part) {
      let currentOption = option;
      let currentLevel = 0;
      const generationMap: number[] = [];

      for (; currentLevel < levels; currentLevel++) {
        currentOption = getInstructions(currentOption);

        if (
          generationMap.at(currentLevel) &&
          currentOption.length > generationMap[currentLevel]
        ) {
          break;
        }

        generationMap[currentLevel] = currentOption.length;
      }

      if (
        currentLevel === levels &&
        (shortestOption.length === 0 ||
          currentOption.length < shortestOption.length)
      ) {
        shortestOption = currentOption;
      }
    }

    shortestInstructions = shortestInstructions.concat(shortestOption);
  }
  return shortestInstructions;
};

let totalA = 0;
let totalB = 0;

for (const number of input) {
  const instructionOptionParts = getNumberInstructionOptions(number.split(""));

  const shortestInstructionsA = iterateLevels(instructionOptionParts, 2);
  const lengthA = shortestInstructionsA.length;

  const shortestInstructionsB = iterateLevels(instructionOptionParts, 10);
  const lengthB = shortestInstructionsB.length;

  const numberPart = Number(number.match(/[1-9][0-9]+/)[0]);

  console.log(number, lengthA, lengthB, numberPart);
  totalA += lengthA * numberPart;
  totalB += lengthB * numberPart;
}

console.log({ totalA, totalB });
