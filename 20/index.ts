import { readFileSync } from "node:fs";

interface INode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: INode | null;
}

function aStarSearch(
  start: INode,
  end: INode,
  map: string[][]
): INode[] | null {
  const openList: INode[] = [];
  const closedList: INode[] = [];

  openList.push(start);

  while (openList.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    const currentNode = openList[lowestIndex];

    if (currentNode.x === end.x && currentNode.y === end.y) {
      const path: INode[] = [];
      let curr: INode | null = currentNode;
      while (curr) {
        path.push(curr);
        curr = curr.parent;
      }
      return path.reverse();
    }

    openList.splice(lowestIndex, 1);
    closedList.push(currentNode);

    const neighbors = getNeighbors(currentNode, map);
    for (const neighbor of neighbors) {
      if (
        closedList.find(
          (node) => node.x === neighbor.x && node.y === neighbor.y
        )
      ) {
        continue;
      }

      const gScore = currentNode.g + 1;
      let gScoreIsBest = false;

      if (
        !openList.find((node) => node.x === neighbor.x && node.y === neighbor.y)
      ) {
        gScoreIsBest = true;
        neighbor.h = heuristic(neighbor, end);
        openList.push(neighbor);
      } else if (gScore < neighbor.g) {
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        neighbor.parent = currentNode;
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }

  return null;
}

function getNeighbors(
  node: INode,
  map: string[][],
  filtered = true,
  distance = 1
): INode[] {
  const neighbors: INode[] = [];
  const directions = [
    { x: 0, y: -1 * distance },
    { x: 1 * distance, y: 0 },
    { x: 0, y: 1 * distance },
    { x: -1 * distance, y: 0 },
  ];

  for (const direction of directions) {
    const x = node.x + direction.x;
    const y = node.y + direction.y;

    if (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
      if (!filtered || map[y][x] !== "#") {
        neighbors.push({ x, y, g: 0, h: 0, f: 0, parent: null });
      }
    }
  }

  return neighbors;
}

function heuristic(node: INode, end: INode): number {
  return Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
}

/// -----

const map = readFileSync("input.txt", "utf8")
  .split("\n")
  .map((el) => el.split("")) as string[][];

function findPosition(
  map: string[][],
  letter: string
): { x: number; y: number } | null {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === letter) {
        return { x, y };
      }
    }
  }
  return null;
}

const startCoords = findPosition(map, "S")!;
const start: INode = {
  x: startCoords.x,
  y: startCoords.y,
  g: 0,
  h: 0,
  f: 0,
  parent: null,
};
const endCoords = findPosition(map, "E")!;
const end: INode = {
  x: endCoords.x,
  y: endCoords.y,
  g: 0,
  h: 0,
  f: 0,
  parent: null,
};

const path = aStarSearch(start, end, map);

console.log("found path length:", path!.length - 1);

const cheatOptions: Record<number, number> = {};

for (const [i, node] of (path ?? []).entries()) {
  const remainingPath = path!.slice(i);
  const neighbors = getNeighbors(node, map, false, 2);

  for (const neighbor of neighbors) {
    const resultingPosition = remainingPath?.findIndex(
      (el) => el.x === neighbor.x && el.y === neighbor.y
    );

    if (resultingPosition <= 2) {
      continue;
    }

    const saving = resultingPosition - 2;

    cheatOptions[saving] = (cheatOptions[saving] ?? 0) + 1;
  }
}

console.log({
  cheatOptions: Object.entries(cheatOptions).reduce((count, currentValue) => {
    if (Number(currentValue[0]) >= 100) {
      return count + currentValue[1];
    }
    return count;
  }, 0),
});

const cheatOptions2: Record<number, number> = {};

for (const [i, node] of (path ?? []).entries()) {
  const remainingPath = path!.slice(i);

  for (let j = 0; j < remainingPath.length; j++) {
    const bestDistance =
      Math.abs(node.x - remainingPath[j].x) +
      Math.abs(node.y - remainingPath[j].y);
    if (bestDistance <= 20 && bestDistance < j) {
      const saving = j - bestDistance;
      cheatOptions2[saving] = (cheatOptions2[saving] ?? 0) + 1;
    }
  }
}
console.log({
  cheatOptions: Object.entries(cheatOptions2).reduce((count, currentValue) => {
    if (Number(currentValue[0]) >= 100) {
      return count + currentValue[1];
    }
    return count;
  }, 0),
});
