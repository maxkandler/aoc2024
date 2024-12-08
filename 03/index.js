import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const findings = [...data.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/gm)];

let total = 0;
let isActive = true;
for (const finding of findings) {
  if (finding[0] === "do()") {
    isActive = true;
  } else if (finding[0] === "don't()") {
    isActive = false;
  } else if (isActive) {
    total += parseInt(finding[1]) * parseInt(finding[2]);
  }
}

console.log(total);
