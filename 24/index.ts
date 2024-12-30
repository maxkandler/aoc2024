import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf8").split("\n");

let wires = new Map<string, number | Array<string | number>>();

for (const line of input) {
  if (line.includes(": ")) {
    const [variable, value] = line.split(": ") as [string, string];
    wires.set(variable, Number(value));
  }
  if (line.includes(" -> ")) {
    const [equation, variable] = line.split(" -> ") as [string, string];
    const [first, operator, second] = equation.split(" ");
    wires.set(variable, [first, operator, second]);
  }
}

const iterateWires = () => {
  for (const [key, value] of wires) {
    if (typeof value === "number") continue;

    const [first, operator, second] = value;

    let newFirst = first;
    if (typeof first !== "number") {
      const value = wires.get(first);
      if (typeof value === "number") {
        newFirst = value;
      }
    }

    let newSecond = second;
    if (typeof second !== "number") {
      const value = wires.get(second);
      if (typeof value === "number") {
        newSecond = value;
      }
    }

    if (typeof newFirst === "number" && typeof newSecond === "number") {
      let result;
      switch (operator) {
        case "AND":
          result = newFirst & newSecond;
          break;
        case "OR":
          result = newFirst | newSecond;
          break;
        case "XOR":
          result = newFirst ^ newSecond;
          break;
      }

      wires.set(key, result);
      continue;
    }

    wires.set(key, [newFirst, operator, newSecond]);
  }
};

const part1 = () => {
  while (true) {
    if (
      [...wires.keys()].every((key) => {
        if (key.startsWith("z")) {
          if (typeof wires.get(key) === "number") {
            return true;
          }

          return false;
        }
        return true;
      })
    ) {
      break;
    }
    iterateWires();
  }

  const zkeys = [...wires.keys()]
    .filter((key) => key.startsWith("z"))
    .sort()
    .reverse();
  return parseInt(zkeys.map((key) => wires.get(key)).join(""), 2);
};

console.log({ part1: part1() });
