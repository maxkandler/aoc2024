import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const map = [];

for (const line of data.split("\n")) {
  map.push(line.split(""));
}

const lineLength = map[0].length;

const checkInDirection = (posX, posY, dirX, dirY) => {
  const totalX = posX + dirX * 3;
  if (totalX < 0 || totalX >= lineLength) {
    return false;
  }

  const totalY = posY + dirY * 3;
  if (totalY < 0 || totalY >= map.length) {
    return false;
  }

  if (
    map[posY][posX] === "X" &&
    map[posY + dirY][posX + dirX] === "M" &&
    map[posY + dirY * 2][posX + dirX * 2] === "A" &&
    map[posY + dirY * 3][posX + dirX * 3] === "S"
  ) {
    // console.log(posX, posY, dirX, dirY);
    return true;
  }
  return false;
};

let found = 0;
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === "X") {
      // W
      if (checkInDirection(x, y, 1, 0)) {
        found++;
      }

      // E
      if (checkInDirection(x, y, -1, 0)) {
        found++;
      }

      // S
      if (checkInDirection(x, y, 0, 1)) {
        found++;
      }

      // N
      if (checkInDirection(x, y, 0, -1)) {
        found++;
      }

      // NE
      if (checkInDirection(x, y, -1, -1)) {
        found++;
      }

      // SE
      if (checkInDirection(x, y, -1, 1)) {
        found++;
      }

      // NW
      if (checkInDirection(x, y, 1, -1)) {
        found++;
      }

      // SW
      if (checkInDirection(x, y, 1, 1)) {
        found++;
      }
    }
  }
}

console.log(found);
