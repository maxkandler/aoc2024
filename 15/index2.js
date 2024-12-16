import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").split("\n");

const originalMap = [];
const instructions = [];

for (const line of input) {
  if (line == "") {
    continue;
  }
  if (line.startsWith("#") && line.endsWith("#")) {
    originalMap.push(line.split(""));
    continue;
  }
  instructions.push(...line.split(""));
}

const map = [];
for (const line of originalMap) {
  const newLine = [];
  for (const char of line) {
    switch (char) {
      case "#":
        newLine.push("#", "#");
        break;
      case "O":
        newLine.push("[", "]");
        break;
      case ".":
        newLine.push(".", ".");
        break;
      case "@":
        newLine.push("@", ".");
    }
  }
  map.push(newLine);
}

const getRobotPosition = (map) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "@") {
        return { x: j, y: i };
      }
    }
  }
};

const getMove = (instruction) => {
  if (instruction === "^") {
    return { x: 0, y: -1 };
  } else if (instruction === ">") {
    return { x: 1, y: 0 };
  } else if (instruction === "v") {
    return { x: 0, y: 1 };
  } else if (instruction === "<") {
    return { x: -1, y: 0 };
  }
};

const isBorder = (map, x, y) => {
  return map[y][x] === "#";
};

const isBox = (map, x1, x2, y) => {
  return (
    map[y][x1] !== "." &&
    map[y][x2] !== "." &&
    !isBorder(map, x1, y) &&
    !isBorder(map, x2, y)
  );
};

const pushHorizontal = (map, x, y, move) => {
  const elementsToPush = [];
  let movingX = x;
  while (movingX < map[y].length && movingX >= 0) {
    if (map[y][movingX] === "#") {
      return false;
    }
    if (map[y][movingX] === ".") {
      break;
    }
    elementsToPush.push({ x: movingX, y });
    movingX += move.x;
  }

  elementsToPush.reverse();
  for (const element of elementsToPush) {
    console.log(map[element.y][element.x + move.x], map[element.y][element.x]);
    map[element.y][element.x + move.x] = map[element.y][element.x];
    map[element.y][element.x] = ".";
  }

  return true;
};

const pushVertical = (map, inputX, inputY, move) => {
  if (map[inputY][inputX] === "#") {
    return false;
  }
  if (map[inputY][inputX] === ".") {
    return true;
  }

  let movingY = inputY;

  const elementsToPush = [];
  const elementsFirstRow = new Set();

  elementsFirstRow.add(`${inputX},${movingY}`);
  if (map[movingY][inputX] === "[") {
    elementsFirstRow.add(`${inputX + 1},${movingY}`);
  }
  if (map[movingY][inputX] === "]") {
    elementsFirstRow.add(`${inputX - 1},${movingY}`);
  }

  elementsToPush.push(elementsFirstRow);

  while (true) {
    movingY += move.y;

    let allClear = true;

    let newElementsLastRow = new Set();

    for (const element of elementsToPush.at(-1)) {
      const [elementX, elementY] = element.split(",").map(Number);

      if (map[movingY][elementX] === "#") {
        return false;
      }

      if (map[movingY][elementX] !== ".") {
        allClear = false;
        newElementsLastRow.add(`${elementX},${movingY}`);

        if (map[movingY][elementX] === "[") {
          newElementsLastRow.add(`${elementX + 1},${movingY}`);
        }
        if (map[movingY][elementX] === "]") {
          newElementsLastRow.add(`${elementX - 1},${movingY}`);
        }
      }
    }

    elementsToPush.push(newElementsLastRow);

    if (allClear) {
      break;
    }
  }

  console.log(5, elementsToPush);
  for (const row of [...elementsToPush.values()].reverse()) {
    console.log(row.values());
    for (const cell of row.values()) {
      const [x, y] = cell.split(",").map(Number);
      if (x === inputX && y === inputY) {
        // continue;
      }
      map[y + move.y][x] = map[y][x];
      console.log(map[y][x]);
      map[y][x] = ".";
    }
  }
  return true;
};

const robotPosition = getRobotPosition(map);

console.log(map.map((line) => line.join("")).join("\n"));

for (const instruction of instructions) {
  let move = getMove(instruction);

  const nextPosition = {
    x: robotPosition.x + move.x,
    y: robotPosition.y + move.y,
  };

  if (isBorder(map, nextPosition.x, nextPosition.y)) {
    continue;
  }

  if (move.x !== 0) {
    console.log(instruction, "horizontal");

    if (!pushHorizontal(map, nextPosition.x, nextPosition.y, move)) {
      continue;
    }
  }

  if (move.y !== 0) {
    console.log(instruction, "vertical");

    if (!pushVertical(map, nextPosition.x, nextPosition.y, move)) {
      continue;
    }
  }

  map[robotPosition.y][robotPosition.x] = ".";
  robotPosition.x = nextPosition.x;
  robotPosition.y = nextPosition.y;
  map[robotPosition.y][robotPosition.x] = "@";
  console.log(map.map((line) => line.join("")).join("\n"));
}

let gpsPositions = 0;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    let horizontalDistance = Math.min(j, map[i].length - j);
    if (map[i][j] === "[") {
      console.log(i, j);
      const verticalDistance = Math.min(i, map.length - i - 1);
      const horizontalDistance = Math.min(j, map[i].length - j - 2);
      console.log(i, j, verticalDistance, horizontalDistance);
      gpsPositions += i * 100 + j;
    }
  }
}

// Part 1
console.log(map.map((line) => line.join("")).join("\n"));
console.log(gpsPositions);
