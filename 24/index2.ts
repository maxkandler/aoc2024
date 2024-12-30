import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf8").split("\n");

type Instruction = {
  inputA: string;
  inputB: string;
  operator: string;
  result: string;
};

const instructions: Instruction[] = [];

for (const line of input.filter((line) => line.includes(" -> "))) {
  // fvk OR hgj -> wvn
  const parts = line.split(" ");
  instructions.push({
    inputA: parts[0],
    inputB: parts[2],
    operator: parts[1],
    result: parts[4],
  });
}

const incorrect: Instruction[] = [];

for (let i = 0; i <= 44; i++) {
  const id = i.toString().padStart(2, "0");

  const resultInstruction = instructions.find(
    (instruction) => instruction.result === `z${id}`
  )!;

  // For final step of addition -> always XOR
  if (resultInstruction.operator !== "XOR") {
    incorrect.push(resultInstruction);
  }

  const xorInstruction = instructions.find(
    (elem) =>
      elem.operator === "XOR" &&
      ((elem.inputA === `x${id}` && elem.inputB === `y${id}`) ||
        (elem.inputA === `y${id}` && elem.inputB === `x${id}`))
  )!;

  const andInstruction = instructions.find(
    (elem) =>
      elem.operator === "AND" &&
      ((elem.inputA === `x${id}` && elem.inputB === `y${id}`) ||
        (elem.inputA === `y${id}` && elem.inputB === `x${id}`))
  )!;

  // To go into the next slot -> the result of AND must go to an OR
  const followingOr = instructions.find(
    (elem) =>
      elem.inputA === andInstruction.result ||
      elem.inputB === andInstruction.result
  );
  // ... unless it's the first one
  if (followingOr !== undefined && followingOr.operator !== "OR" && i > 0) {
    incorrect.push(andInstruction);
  }

  // First Position must come from an AND or XOR
  const firstPosition = instructions.find(
    (elem) =>
      elem.inputA === xorInstruction.result ||
      elem.inputB === xorInstruction.result
  );
  if (
    firstPosition !== undefined &&
    firstPosition.operator !== "AND" &&
    firstPosition.operator !== "XOR"
  ) {
    incorrect.push(xorInstruction);
  }
}

// All XORs must influence a z, based on x and y values
for (const instruction of instructions) {
  if (
    instruction.operator === "XOR" &&
    !instruction.result.startsWith("z") &&
    !(
      instruction.inputA.startsWith("x") || instruction.inputA.startsWith("y")
    ) &&
    !(instruction.inputB.startsWith("x") || instruction.inputB.startsWith("y"))
  ) {
    incorrect.push(instruction);
  }
}

console.log(
  incorrect
    .map((el) => el.result)
    .sort()
    .join(",")
);
