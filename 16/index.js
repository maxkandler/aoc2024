import { readFileSync } from "node:fs";

const map = readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

// console.log(map.map((line) => line.join("")).join("\n"));

let cheapest = Infinity;
let cheapestPathTiles = [];

const costPerTurn = 1000;

const getCostForTurn = (direction, newDirection) => {
  return newDirection.x !== direction.x
    ? Math.abs(newDirection.x - direction.x) * costPerTurn
    : 0 + newDirection.y !== direction.y
    ? Math.abs(newDirection.y - direction.y) * costPerTurn
    : 0;
};

const visited = [];

const findPath = (position, originalDirection, direction, traveled, cost) => {
  if (cost > cheapest) {
    return;
  }

  cost += getCostForTurn(originalDirection, direction);

  if (map[position.y][position.x] === "E") {
    console.log(cost, cheapest, traveled);
    if (cost == cheapest) {
      console.log("Found path with same cost", cost, traveled);
      cheapestPathTiles.push(...traveled);
    }
    if (cost < cheapest) {
      cheapestPathTiles = [...traveled];
      cheapest = cost;
    }
    return;
  }

  if (
    `${position.x},${position.y}` in visited &&
    visited[`${position.x},${position.y}`] < cost
  ) {
    return;
  }

  if (map[position.y][position.x] === "#") {
    return;
  }

  visited[`${position.x},${position.y}`] = cost;
  traveled.push(`${position.x},${position.y}`);

  cost++;

  const up = findPath(
    { x: position.x, y: position.y - 1 },
    direction,
    { x: 0, y: -1 },
    [...traveled],
    cost
  );
  const right = findPath(
    { x: position.x + 1, y: position.y },
    direction,
    { x: 1, y: 0 },
    [...traveled],
    cost
  );
  const down = findPath(
    { x: position.x, y: position.y + 1 },
    direction,
    { x: 0, y: 1 },
    [...traveled],
    cost
  );
  const left = findPath(
    { x: position.x - 1, y: position.y },
    direction,
    { x: -1, y: 0 },
    [...traveled],
    cost
  );

  if (up || right || down || left) {
    return true;
  }

  return false;
};

const getStartingPosition = (map) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") {
        return { x: j, y: i };
      }
    }
  }
};

const startPosition = getStartingPosition(map);

findPath(startPosition, { x: 1, y: 0 }, { x: 1, y: 0 }, [], 0);

console.log({ cheapest, countTiles: new Set(cheapestPathTiles).size });

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (cheapestPathTiles.includes(`${j},${i}`)) {
      process.stdout.write("O");
    } else {
      process.stdout.write(map[i][j]);
    }
  }
  process.stdout.write("\n");
}
