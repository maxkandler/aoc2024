import { readFileSync } from "node:fs";

const data = readFileSync("./input.txt", "utf8");
const lines = data.split("\n");

const inputs = [];
let currentInput = {};
for (const line of lines) {
  if (line === "") {
    continue;
  }

  const [key, value] = line.split(": ");
  const matchedInput = value.match(/X[\+,=](\d+), Y[\+,=](\d+)/);
  const values = {
    x: Number.parseInt(matchedInput[1]),
    y: Number.parseInt(matchedInput[2]),
  };

  switch (key) {
    case "Button A":
      currentInput.buttonA = values;
      break;
    case "Button B":
      currentInput.buttonB = values;
      break;
    case "Prize":
      currentInput.prize = {
        x: values.x,
        y: values.y,
      };
      inputs.push(currentInput);
      currentInput = {};
      break;
  }
}

const costA = 3;
const costB = 1;

const calculateTokens = (input, offset = 0) => {
  const targetX = input.prize.x + offset;
  const targetY = input.prize.y + offset;

  const countB =
    (input.buttonA.y * targetX - input.buttonA.x * targetY) /
    (input.buttonA.y * input.buttonB.x - input.buttonA.x * input.buttonB.y);
  const countA = (targetY - input.buttonB.y * countB) / input.buttonA.y;

  if (
    countA % 1 === 0 &&
    countB % 1 === 0 &&
    targetX === input.buttonA.x * countA + input.buttonB.x * countB &&
    targetY === input.buttonA.y * countA + input.buttonB.y * countB
  ) {
    return countA * costA + countB * costB;
  }
  return 0;
};

let totalTokens = 0;
let totalTokensWithOffset = 0;

for (const input of inputs) {
  totalTokens += calculateTokens(input);
  totalTokensWithOffset += calculateTokens(input, 10000000000000);
}

// 29877
console.log({ totalTokens, totalTokensWithOffset });
