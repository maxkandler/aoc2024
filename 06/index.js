import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");
const map = data.split("\n").map((line) => line.split(""));

const width = map[0].length;
const height = map.length;

const getStartPosition = () => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map[y][x] === "^") {
        return { x, y };
      }
    }
  }
};

let startingDirection = "^";

const getNextPosition = (position, direction) => {
  const { x, y } = position;
  switch (direction) {
    case "^":
      return { x, y: y - 1 };
    case ">":
      return { x: x + 1, y };
    case "v":
      return { x, y: y + 1 };
    case "<":
      return { x: x - 1, y };
  }
};

const getElementAtPosition = (map, position) => {
  return map[position.y][position.x];
};

const isElementBlocker = (element) => {
  return element === "#" || element === "O";
};

const rotatePosition = (direction) => {
  switch (direction) {
    case "^":
      return ">";
    case ">":
      return "v";
    case "v":
      return "<";
    case "<":
      return "^";
  }
};

const isPositionValid = (position) => {
  return (
    position.x >= 0 &&
    position.x < width &&
    position.y >= 0 &&
    position.y < height
  );
};

const duplicateMap = (map) => {
  return [...map.map((line) => [...line])];
};

const getNextDirectionOnMap = (map, position, direction) => {
  let currentDirection = direction;
  while (
    isElementBlocker(
      getElementAtPosition(map, getNextPosition(position, currentDirection))
    )
  ) {
    currentDirection = rotatePosition(currentDirection);
  }

  return currentDirection;
};

const walk = (map, position, direction) => {
  let currentPosition = position;
  let currentDirection = direction;

  let optionsForBlockers = [];

  while (true) {
    map[currentPosition.y][currentPosition.x] = currentDirection;

    const nextAhead = getNextPosition(currentPosition, currentDirection);
    if (!isPositionValid(nextAhead)) {
      break;
    }

    currentDirection = getNextDirectionOnMap(
      map,
      currentPosition,
      currentDirection
    );

    const walkResult = walkWithBlocker(
      duplicateMap(map),
      { x: currentPosition.x, y: currentPosition.y },
      currentDirection
    );

    if (walkResult) {
      if (
        !optionsForBlockers.includes(
          (option) => option.x === walkResult.x && option.y === walkResult.y
        )
      ) {
        optionsForBlockers.push(walkResult);
      }
    }

    currentPosition = getNextPosition(currentPosition, currentDirection);
  }

  const mapString = map.map((line) => line.join("")).join("\n");
  return {
    totalSteps: mapString.match(/[\<\>\^v]/g).length,
    optionsForBlockers: optionsForBlockers.length,
  };
};

const walkWithBlocker = (map, position, direction) => {
  let currentPosition = { x: position.x, y: position.y };
  let currentDirection = direction;

  const nextPosition = getNextPosition(currentPosition, currentDirection);
  if (
    !isPositionValid(nextPosition) ||
    getElementAtPosition(map, nextPosition) !== "."
  ) {
    return false;
  }

  map[nextPosition.y][nextPosition.x] = "O";

  while (true) {
    map[currentPosition.y][currentPosition.x] = currentDirection;

    const nextAhead = getNextPosition(currentPosition, currentDirection);
    if (!isPositionValid(nextAhead)) {
      return false;
    }

    currentDirection = getNextDirectionOnMap(
      map,
      currentPosition,
      currentDirection
    );

    currentPosition = getNextPosition(currentPosition, currentDirection);

    if (getElementAtPosition(map, currentPosition) == currentDirection) {
      return nextPosition;
    }
  }
};

console.log(walk(map, getStartPosition(), startingDirection));
