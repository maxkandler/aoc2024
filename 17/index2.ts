import { readFileSync } from "node:fs";

const register = {
  A: BigInt(0),
  B: BigInt(0),
  C: BigInt(0),
};

const instructions: number[] = [];

const data = readFileSync("./input.txt", "utf8").split("\n");
let a = BigInt(0);
for (const line of data) {
  const [target, value] = line.split(": ");

  if (target === "Register A") {
    register.A = BigInt(parseInt(value));
    a = BigInt(parseInt(value));
  } else if (target === "Register B") {
    register.B = BigInt(parseInt(value));
  } else if (target === "Register C") {
    register.C = BigInt(parseInt(value));
  } else if (target === "Program") {
    instructions.push(...value.split(",").map((x) => parseInt(x)));
  }
}

const getOperandValue = (operand: number): bigint => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return BigInt(operand);
    case 4:
      return BigInt(register.A);
    case 5:
      return BigInt(register.B);
    case 6:
      return BigInt(register.C);
    default:
      throw new Error(`Invalid operand: ${operand}`);
  }
};

let instructionPointer = 0;

let output: any[] = [];

const applyInstructions = (opCode: number, operand: number) => {
  if (opCode === 0) {
    const divisionResult = BigInt(
      Math.trunc(Number(register.A / BigInt(2) ** getOperandValue(operand)))
    );
    register.A = divisionResult;
    instructionPointer += 2;
    return;
  }

  if (opCode === 1) {
    const bitwiseOr = BigInt(register.B) ^ BigInt(operand);
    register.B = bitwiseOr;
    instructionPointer += 2;
    return;
  }

  if (opCode === 2) {
    register.B = getOperandValue(operand) % BigInt(8);
    instructionPointer += 2;
    return;
  }

  if (opCode === 3) {
    if (register.A === BigInt(0)) {
      instructionPointer += 2;
      return;
    }
    instructionPointer = operand;
    return;
  }

  if (opCode === 4) {
    const bitwiseOr = BigInt(register.B) ^ BigInt(register.C);
    register.B = bitwiseOr;
    instructionPointer += 2;
    return;
  }

  if (opCode === 5) {
    const result = getOperandValue(operand) % BigInt(8);
    output.push(result);
    instructionPointer += 2;
    return;
  }

  if (opCode === 6) {
    const divisionResult = Math.trunc(
      Number(register.A / BigInt(2) ** getOperandValue(operand))
    );
    register.B = BigInt(divisionResult);
    instructionPointer += 2;
    return;
  }

  if (opCode === 7) {
    const divisionResult = Math.trunc(
      Number(register.A / BigInt(2) ** getOperandValue(operand))
    );
    register.C = BigInt(divisionResult);
    instructionPointer += 2;
    return;
  }

  throw new Error(`Invalid opCode: ${opCode}`);
};

let number = 0n;

for (let i = instructions.length - 2; i >= 0; i--) {
  const target = instructions.slice(i);
  number *= 8n;

  while (true) {
    register.A = number;
    register.B = BigInt(0);
    register.C = BigInt(0);
    output = [];
    instructionPointer = 0;
    while (instructionPointer < instructions.length) {
      const opCode = instructions[instructionPointer];
      const operand = instructions[instructionPointer + 1];
      applyInstructions(opCode, operand);
    }
    if (target.join(",") === output.join(",")) {
      break;
    }
    number++;
  }
}

console.log(number);
