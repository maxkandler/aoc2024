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

function getNeighbors(node: INode, map: string[][]): INode[] {
  const neighbors: INode[] = [];
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  for (const direction of directions) {
    const x = node.x + direction.x;
    const y = node.y + direction.y;

    if (
      x >= 0 &&
      x < map[0].length &&
      y >= 0 &&
      y < map.length &&
      map[y][x] !== "#"
    ) {
      if (y === 1 && x === 2) {
        console.log("wtf");
      }
      neighbors.push({ x, y, g: 0, h: 0, f: 0, parent: null });
    }
  }

  return neighbors;
}

function heuristic(node: INode, end: INode): number {
  return Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
}

const width = 71;
const height = 71;
const countBytes = 1024;

const map = Array(height)
  .fill([])
  .map(() => Array(width).fill("."));

const input = readFileSync("input.txt", "utf8").split("\n") as string[];

for (let i = 0; i < countBytes; i++) {
  const line = input.shift();
  if (line) {
    const [x, y] = line.split(",").map(Number);
    if (x < width && y < height) {
      map[y][x] = "#";
    }
  }
}

const start: INode = { x: 0, y: 0, g: 0, h: 0, f: 0, parent: null };
const end: INode = { x: 70, y: 70, g: 0, h: 0, f: 0, parent: null };

const path = aStarSearch(start, end, map);

for (const node of path || []) {
  map[node.y][node.x] = "O";
}

console.log({ steps: path?.length ?? 0 - 1 });

while (input.length > 0) {
  const line = input.shift();
  if (line) {
    const [x, y] = line.split(",").map(Number);
    if (x < width && y < height) {
      map[y][x] = "#";

      const path = aStarSearch(start, end, map);
      if (path === null) {
        console.log({ x, y });
        break;
      }
    }
  }
}
