import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf8").split("\n") as string[];

const towels: string[] = [];
const designs: string[] = [];

for (const line of input) {
  if (line.includes(",")) {
    towels.push(...line.split(",").map((x) => x.trim()));
  } else if (line != "") {
    designs.push(line.trim());
  }
}

const cache: Record<string, number> = {};

const getDesignDecomposeOptions = (design: string): number => {
  if (design === "") {
    return 1;
  }
  if (cache[design]) {
    return cache[design];
  }

  let options = 0;
  for (const towel of towels) {
    if (design.startsWith(towel)) {
      options += getDesignDecomposeOptions(design.slice(towel.length));
    }
  }

  cache[design] = options;

  return options;
};

let decomposableDesigns = 0;
let decomposeOptions = 0;

for (const design of designs) {
  const options = getDesignDecomposeOptions(design);
  if (options !== 0) {
    decomposableDesigns++;
  }
  decomposeOptions += options;
}

console.log({ decomposableDesigns, decomposeOptions });
