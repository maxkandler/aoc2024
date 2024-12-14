import { readFileSync } from "node:fs";

const lines = readFileSync("./input.txt", "utf8").split("\n");

const robots = [];

for (const line of lines) {
  if (line === "") {
    continue;
  }

  const matchedInput = line.match(/p=(\-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
  const robot = {
    position: {
      x: Number.parseInt(matchedInput[1]),
      y: Number.parseInt(matchedInput[2]),
    },
    velocity: {
      x: Number.parseInt(matchedInput[3]),
      y: Number.parseInt(matchedInput[4]),
    },
  };
  robots.push(robot);
}

const moveRobot = (robot, gridWidth, gridHeight) => {
  let newX = robot.position.x + robot.velocity.x;
  if (newX < 0) {
    newX += gridWidth;
  }
  if (newX >= gridWidth) {
    newX -= gridWidth;
  }

  let newY = robot.position.y + robot.velocity.y;
  if (newY < 0) {
    newY += gridHeight;
  }
  if (newY >= gridHeight) {
    newY -= gridHeight;
  }

  robot.position.x = newX;
  robot.position.y = newY;

  return robot;
};

const getRobotsInQuadrant = (robots, x, y, width, height) => {
  let countInQuadrant = 0;
  for (const robot of robots) {
    if (
      robot.position.x >= x &&
      robot.position.x < x + width &&
      robot.position.y >= y &&
      robot.position.y < y + height
    ) {
      countInQuadrant++;
    }
  }
  return countInQuadrant;
};

const getQuadrants = (gridWidth, gridHeight) => {
  const width = Math.floor(gridWidth / 2);
  const height = Math.floor(gridHeight / 2);

  return [
    { x: 0, y: 0, width, height },
    { x: width + 1, y: 0, width, height },
    { x: 0, y: height + 1, width, height },
    { x: width + 1, y: height + 1, width, height },
  ];
};

const seconds = 1000;
const gridWidth = 101;
const gridHeight = 103;

let elapsedSeconds = 0;

for (elapsedSeconds; elapsedSeconds < seconds; elapsedSeconds++) {
  for (const robot of robots) {
    moveRobot(robot, gridWidth, gridHeight);
  }
}

const quadrants = getQuadrants(gridWidth, gridHeight);

let safetyFactors = [];

for (const quadrant of quadrants) {
  const count = getRobotsInQuadrant(
    robots,
    quadrant.x,
    quadrant.y,
    quadrant.width,
    quadrant.height
  );
  safetyFactors.push(count);
}

console.log(
  "Safety factor",
  safetyFactors.reduce((acc, curr) => acc * curr, 1)
);

const getMap = (robots, gridWidth, gridHeight) => {
  const map = Array(gridHeight)
    .fill()
    .map(() => Array(gridWidth).fill("."));

  for (const robot of robots) {
    map[robot.position.y][robot.position.x] =
      map[robot.position.y][robot.position.x] === "."
        ? 1
        : map[robot.position.y][robot.position.x] + 1;
  }

  return map;
};

const hasLongLine = (map) => {
  for (let i = 0; i < map.length; i++) {
    let currentLength = 0;
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== ".") {
        currentLength++;
      } else {
        currentLength = 0;
      }
      if (currentLength >= gridWidth / 4) {
        return true;
      }
    }
  }
  return false;
};

while (true) {
  const map = getMap(robots, gridWidth, gridHeight);
  if (hasLongLine(map)) {
    console.log("Seconds", elapsedSeconds);
    console.log(map.map((row) => row.join("")).join("\n"));
    break;
  }
  for (const robot of robots) {
    moveRobot(robot, gridWidth, gridHeight);
  }
  elapsedSeconds++;
}
