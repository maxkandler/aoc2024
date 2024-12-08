import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf8");
const map = data.split("\n").map((line) => line.split(""));
const width = map[0].length;
const height = map.length;

const antennas = {};

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    const spot = map[y][x];
    if (spot !== ".") {
      if (!antennas[spot]) {
        antennas[spot] = [];
      }
      antennas[spot].push({ x, y });
    }
  }
}

let antinodes = [];

let resonantAntinodes = [];

let antennaPositions = [];

for (const [antenna, positions] of Object.entries(antennas)) {
  for (let i = 0; i < positions.length; i++) {
    antennaPositions.push(positions[i]);

    for (let j = 0; j < positions.length; j++) {
      if (i === j) {
        continue;
      }

      const distance = {
        x: positions[i].x - positions[j].x,
        y: positions[i].y - positions[j].y,
      };

      let antinodePosition = {
        x: positions[i].x + distance.x,
        y: positions[i].y + distance.y,
      };

      if (
        antinodePosition.x >= 0 &&
        antinodePosition.x < width &&
        antinodePosition.y >= 0 &&
        antinodePosition.y < height &&
        !antinodes.find(
          (pos) => pos.x === antinodePosition.x && pos.y === antinodePosition.y
        ) &&
        !resonantAntinodes.find(
          (pos) => pos.x === antinodePosition.x && pos.y === antinodePosition.y
        )
      ) {
        antinodes.push(antinodePosition);
      }

      while (
        antinodePosition.x >= 0 &&
        antinodePosition.x < width &&
        antinodePosition.y >= 0 &&
        antinodePosition.y < height
      ) {
        antinodePosition = {
          x: antinodePosition.x + distance.x,
          y: antinodePosition.y + distance.y,
        };

        if (
          antinodePosition.x >= 0 &&
          antinodePosition.x < width &&
          antinodePosition.y >= 0 &&
          antinodePosition.y < height &&
          !antinodes.find(
            (pos) =>
              pos.x === antinodePosition.x && pos.y === antinodePosition.y
          ) &&
          !resonantAntinodes.find(
            (pos) =>
              pos.x === antinodePosition.x && pos.y === antinodePosition.y
          )
        ) {
          resonantAntinodes.push(antinodePosition);
        }
      }
    }
  }
}

for (const antinode of antinodes) {
  if (map[antinode.y][antinode.x] === ".") {
    map[antinode.y][antinode.x] = "@";
  }
}
for (const antinode of resonantAntinodes) {
  if (map[antinode.y][antinode.x] === ".") {
    map[antinode.y][antinode.x] = "%";
  }
}

const mapString = map.map((line) => line.join("")).join("\n");

console.log({
  antinodes: antinodes.length,
  sum: mapString.split("").filter((char) => char !== "." && char !== "\n")
    .length,
});
