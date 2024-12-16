import { readFileSync } from "node:fs";

const map = readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

// console.log(map.map((line) => line.join("")).join("\n"));

let cheapest = Infinity;
let cheapestPathTiles = new Set();

const costPerTurn = 1000;

const getCostForTurn = (direction, newDirection) => {
  return newDirection.x !== direction.x
    ? Math.abs(newDirection.x - direction.x) * costPerTurn
    : 0 + newDirection.y !== direction.y
    ? Math.abs(newDirection.y - direction.y) * costPerTurn
    : 0;
};

const visited = [];
const queue = [];

const addToQueue = (position, currentDirection, traveled, cost) => {
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];
  cost++;

  if (visited[`${position.x},${position.y}`] + 1000 < cost) {
    return;
  }
  visited[`${position.x},${position.y}`] = cost;

  for (const direction of directions) {
    const nextPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };
    if (map[nextPosition.y][nextPosition.x] === "#") {
      continue;
    }
    if (traveled.includes(`${nextPosition.x},${nextPosition.y}`)) {
      continue;
    }
    if (map[nextPosition.y][nextPosition.x] === "E") {
      traveled.push(`${nextPosition.x},${nextPosition.y}`);
      if (cost < cheapest) {
        cheapestPathTiles = new Set(traveled);
        cheapest = cost;
      }
      if (cost == cheapest) {
        cheapestPathTiles = new Set([...cheapestPathTiles, ...traveled]);
      }
      return;
    }

    const newCost = cost + getCostForTurn(currentDirection, direction);
    if (newCost > cheapest) {
      return;
    }

    queue.push({
      position: { x: nextPosition.x, y: nextPosition.y },
      direction,
      traveled: [...traveled, `${nextPosition.x},${nextPosition.y}`],
      cost: newCost,
    });
  }
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

addToQueue(
  startPosition,
  { x: 1, y: 0 },
  [`${startPosition.x},${startPosition.y}`],
  0
);
while (queue.length > 0) {
  const { position, direction, traveled, cost } = queue.shift();
  addToQueue(position, direction, traveled, cost);
}
console.log({ cheapest, countTiles: cheapestPathTiles.size });

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (cheapestPathTiles.has(`${j},${i}`)) {
      process.stdout.write("O");
    } else {
      process.stdout.write(map[i][j]);
    }
  }
  process.stdout.write("\n");
}
