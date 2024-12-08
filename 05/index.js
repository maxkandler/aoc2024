import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const orderingRules = [];

const manuals = [];

for (const line of data.split("\n")) {
  if (line.includes("|")) {
    orderingRules.push(line.split("|").map((x) => Number.parseInt(x, 10)));
  }
  if (line.includes(",")) {
    manuals.push(line.split(",").map((x) => Number.parseInt(x, 10)));
  }
}

const isManualCorrect = (manual) => {
  const reversedManual = manual.toReversed();
  for (let i = 0; i < reversedManual.length; i++) {
    if (doesPageComeBefore(reversedManual[i], reversedManual.slice(i))) {
      return false;
    }
  }

  return true;
};

const doesPageComeBefore = (currentPage, nextPages) => {
  const rules = orderingRules.filter((x) => x[0] === currentPage);
  for (const rule of rules) {
    if (nextPages.includes(rule[1])) {
      return true;
    }
  }
};
let total = 0;
const remainingManuals = [];
for (const manual of manuals) {
  if (isManualCorrect(manual)) {
    total += manual[Math.floor(manual.length / 2)];
  } else {
    remainingManuals.push(manual);
  }
}

console.log(total);

const fixManual = (pages) => {
  const fixedPages = [];
  const remainingPages = [...pages];

  for (let i = 0; i < pages.length; i++) {
    for (const page of remainingPages) {
      const matchingRules = orderingRules.filter(
        (rule) => rule[0] === page && remainingPages.includes(rule[1])
      );
      if (matchingRules.length === 0) {
        fixedPages.push(page);
        remainingPages.splice(remainingPages.indexOf(page), 1);
      }
    }
  }
  fixedPages.reverse();
  // console.log(pages, fixedPages, remainingPages);
  return fixedPages.toReversed();
};

let totalRemaining = 0;

for (const manual of remainingManuals) {
  const fixedManual = fixManual(manual);
  totalRemaining += fixedManual[Math.floor(fixedManual.length / 2)];
}

console.log(totalRemaining);
