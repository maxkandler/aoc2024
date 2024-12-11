import { parentPort, workerData } from "worker_threads";

const cache = {};

const generateNextNumber = (number) => {
  if (number === 0) {
    return [1];
  }

  const numberString = `${number}`;
  if (numberString.length % 2 === 0) {
    return [
      Number.parseInt(numberString.slice(0, numberString.length / 2)),
      Number.parseInt(numberString.slice(numberString.length / 2)),
    ];
  }

  return [number * 2024];
};

const iterateNumbers = (numbers, remainingGenerations) => {
  if (remainingGenerations === 0) {
    return numbers.length;
  }

  let numberCount = 0;
  for (const number of numbers) {
    if (cache[`n${number}_g${remainingGenerations}`]) {
      numberCount += cache[`n${number}_g${remainingGenerations}`];
      continue;
    }
    const result = iterateNumbers(
      generateNextNumber(number),
      remainingGenerations - 1
    );
    cache[`n${number}_g${remainingGenerations}`] = result;

    numberCount += result;
  }
  return numberCount;
};

const countOfNumbers = iterateNumbers(
  workerData.numbers,
  workerData.generations
);

parentPort.postMessage(countOfNumbers);
