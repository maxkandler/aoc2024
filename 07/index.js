import { readFileSync } from "fs";
import assert from "node:assert";

const data = readFileSync("./input.txt", "utf8");
const equations = data.split("\n");

const splitEquation = (equation) => {
  const result = Number.parseInt(equation.split(": ")[0], 10);
  const numbers = equation
    .split(": ")[1]
    .split(" ")
    .map((number) => Number.parseInt(number, 10));

  return { result, numbers };
};

// 0 = +
// 1 = *
// 2 = ||

const getOperatorCombinations = (length, operatorOptions) => {
  const combinations = [];
  for (let i = 0; i < operatorOptions ** length; i++) {
    combinations.push(i.toString(operatorOptions).padStart(length, "0"));
  }
  return combinations;
};

const canEquationBeCorrect = (result, numbers, operatorCombinations) => {
  for (const operators of operatorCombinations) {
    let total = numbers[0];
    let numberIndex = 1;
    for (const operator of operators) {
      if (operator === "0") {
        total += numbers[numberIndex];
      }
      if (operator === "1") {
        total *= numbers[numberIndex];
      }
      if (operator === "2") {
        total = Number.parseInt(`${total}${numbers[numberIndex]}`, 10);
      }

      numberIndex++;

      if (total > result) {
        break;
      }
    }
    if (total === result) {
      return true;
    }
  }
  return false;
};

let totalCalibration = 0;
let totalCalibrationConcat = 0;

for (const equation of equations) {
  const { result, numbers } = splitEquation(equation);
  const operatorCombinations = getOperatorCombinations(numbers.length - 1, 2);

  if (canEquationBeCorrect(result, numbers, operatorCombinations)) {
    totalCalibration += result;
    continue;
  }

  const operatorCombinationsConcat = getOperatorCombinations(
    numbers.length - 1,
    3
  );
  if (canEquationBeCorrect(result, numbers, operatorCombinationsConcat)) {
    totalCalibrationConcat += result;
    continue;
  }
}

// assert(totalCalibration, "3351424677624");

console.log({
  totalCalibration,
  totalCalibrationConcat,
  sum: totalCalibration + totalCalibrationConcat,
});
