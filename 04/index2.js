import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");

const map = [];

for (const line of data.split("\n")) {
  map.push(line.split(""));
}

const lineLength = map[0].length;

const checkInDirection = (posX, posY) => {
  if (posX - 1 < 0 || posX + 1 >= lineLength) {
    return false;
  }

  if (posY - 1 < 0 || posY + 1 >= map.length) {
    return false;
  }

  if (
    map[posY][posX] === "A" &&
    // backslash
    ((map[posY - 1][posX - 1] === "M" && map[posY + 1][posX + 1] === "S") ||
      (map[posY - 1][posX - 1] === "S" && map[posY + 1][posX + 1] === "M")) &&
    ((map[posY - 1][posX + 1] === "M" && map[posY + 1][posX - 1] === "S") ||
      (map[posY - 1][posX + 1] === "S" && map[posY + 1][posX - 1] === "M"))
  ) {
    console.log(
      map[posY - 1][posX - 1],
      map[posY][posX],
      map[posY + 1][posX + 1],
      map[posY - 1][posX + 1],
      map[posY][posX],
      map[posY + 1][posX - 1]
    );
    return true;
  }
  return false;
};

let found = 0;
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    // W
    if (checkInDirection(x, y, 1, 0)) {
      found++;
    }
  }
}

console.log(found);
