import { readFileSync } from "fs";
import { Worker } from "worker_threads";

const data = readFileSync("./input.txt", "utf8");
const numbers = data.split(" ").map((entry) => [Number.parseInt(entry)]);

const createWorker = (number, generations) => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./worker.js", {
      workerData: {
        numbers: number,
        generations: generations,
      },
    });

    worker.on("message", (result) => {
      resolve(result);
    });

    worker.on("error", (error) => {
      console.error(error);
      reject(error);
    });
  });
};

const results25 = await Promise.all(
  numbers.map((number) => createWorker(number, 25))
);

console.log(
  "Total count of numbers for 25 generations:",
  results25.reduce((acc, val) => acc + val, 0)
);

const results75 = await Promise.all(
  numbers.map((number) => createWorker(number, 75))
);

console.log(
  "Total count of numbers for 75 generations:",
  results75.reduce((acc, val) => acc + val, 0)
);
