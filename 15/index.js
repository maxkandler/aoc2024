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

const map = originalMap.map((line) => [...line]);

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

const isBox = (map, x, y) => {
  return map[y][x] === "O";
};

const moveBox = (map, x, y, move) => {
  if (isBorder(map, x, y)) {
    return false;
  }

  if (!isBox(map, x, y)) {
    map[y][x] = "O";
    return true;
  }

  return moveBox(map, x + move.x, y + move.y, move);
};

const robotPosition = getRobotPosition(map);

for (const instruction of instructions) {
  let move = getMove(instruction);

  const nextPosition = {
    x: robotPosition.x + move.x,
    y: robotPosition.y + move.y,
  };

  if (isBorder(map, nextPosition.x, nextPosition.y)) {
    continue;
  }

  if (isBox(map, nextPosition.x, nextPosition.y)) {
    if (!moveBox(map, nextPosition.x, nextPosition.y, move)) {
      continue;
    }
  }

  map[robotPosition.y][robotPosition.x] = ".";
  robotPosition.x = nextPosition.x;
  robotPosition.y = nextPosition.y;
  map[robotPosition.y][robotPosition.x] = "@";
}

let gpsPositions = 0;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] === "O") {
      gpsPositions += i * 100 + j;
    }
  }
}

console.log(map.map((line) => line.join("")).join("\n"));
console.log(gpsPositions);
