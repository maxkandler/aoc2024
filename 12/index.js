import { readFileSync } from "node:fs";

const data = readFileSync("./input.txt", "utf8");
const map = data.split("\n").map((line) => line.split(""));
const width = map[0].length;
const height = map.length;

const getMatchingPlots = (x, y, plant) => {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return [];
  }

  if (map[y][x] === ".") {
    return [];
  }

  const plots = [];

  if (map[y][x] === plant) {
    plots.push({ x, y, letter: map[y][x] });
    map[y][x] = ".";
  } else {
    return [];
  }

  plots.push(...getMatchingPlots(x - 1, y, plant));
  plots.push(...getMatchingPlots(x + 1, y, plant));
  plots.push(...getMatchingPlots(x, y - 1, plant));
  plots.push(...getMatchingPlots(x, y + 1, plant));

  return plots;
};

const getPerimeter = (plots) => {
  let perimeter = 0;
  for (const plot of plots) {
    const { x, y } = plot;

    const topNeighbor = plots.find((p) => p.x === x && p.y === y - 1);
    const bottomNeighbor = plots.find((p) => p.x === x && p.y === y + 1);
    const leftNeighbor = plots.find((p) => p.x === x - 1 && p.y === y);
    const rightNeighbor = plots.find((p) => p.x === x + 1 && p.y === y);

    if (!topNeighbor) {
      perimeter++;
    }
    if (!bottomNeighbor) {
      perimeter++;
    }
    if (!leftNeighbor) {
      perimeter++;
    }
    if (!rightNeighbor) {
      perimeter++;
    }
  }
  return perimeter;
};

const addBorders = (plots) => {
  const plotsWithBorders = [];
  for (const { x, y } of plots) {
    const topNeighbor = plots.find((p) => p.x === x && p.y === y - 1);
    const bottomNeighbor = plots.find((p) => p.x === x && p.y === y + 1);
    const leftNeighbor = plots.find((p) => p.x === x - 1 && p.y === y);
    const rightNeighbor = plots.find((p) => p.x === x + 1 && p.y === y);

    const borders = [];
    if (!topNeighbor) {
      borders.push("top");
    }
    if (!bottomNeighbor) {
      borders.push("bottom");
    }
    if (!leftNeighbor) {
      borders.push("left");
    }
    if (!rightNeighbor) {
      borders.push("right");
    }
    plotsWithBorders.push({ x, y, borders });
  }
  return plotsWithBorders;
};

const filterBorderInDirection = (plotsWithBorders, x, y, border, direction) => {
  let currentX = x;
  let currentY = y;
  while (true) {
    const nextX =
      direction === "right"
        ? currentX + 1
        : direction === "left"
        ? currentX - 1
        : currentX;

    const nextY =
      direction === "top"
        ? currentY - 1
        : direction === "bottom"
        ? currentY + 1
        : currentY;

    const neighbor = plotsWithBorders.find(
      (p) => p.x === nextX && p.y === nextY
    );
    if (neighbor && neighbor.borders.includes(border)) {
      neighbor.borders = neighbor.borders.filter((b) => b !== border);
      currentX = nextX;
      currentY = nextY;
    } else {
      break;
    }
  }
};

const getNumberOfSides = (plots) => {
  const plotsWithBorders = addBorders(plots);

  let sides = 0;

  for (const plot of plotsWithBorders) {
    const { x, y } = plot;

    if (plot.borders.includes("top")) {
      sides++;
      filterBorderInDirection(plotsWithBorders, x, y, "top", "left");
      filterBorderInDirection(plotsWithBorders, x, y, "top", "right");
      plot.borders = plot.borders.filter((b) => b !== "top");
    }

    if (plot.borders.includes("bottom")) {
      sides++;
      filterBorderInDirection(plotsWithBorders, x, y, "bottom", "left");
      filterBorderInDirection(plotsWithBorders, x, y, "bottom", "right");
      plot.borders = plot.borders.filter((b) => b !== "bottom");
    }

    if (plot.borders.includes("left")) {
      sides++;
      filterBorderInDirection(plotsWithBorders, x, y, "left", "top");
      filterBorderInDirection(plotsWithBorders, x, y, "left", "bottom");
      plot.borders = plot.borders.filter((b) => b !== "left");
    }

    if (plot.borders.includes("right")) {
      sides++;
      filterBorderInDirection(plotsWithBorders, x, y, "right", "top");
      filterBorderInDirection(plotsWithBorders, x, y, "right", "bottom");
      plot.borders = plot.borders.filter((b) => b !== "right");
    }
  }
  return sides;
};

const regions = [];

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    if (map[y][x] !== ".") {
      regions.push(getMatchingPlots(x, y, map[y][x]));
    }
  }
}

let totalCost = 0;
let totalCostDiscounted = 0;

for (const region of regions) {
  const area = region.length;
  const perimeter = getPerimeter(region);
  const numberOfSides = getNumberOfSides(region);

  const cost = area * perimeter;
  const costDiscounted = area * numberOfSides;

  //   console.log({
  //     letter: region[0].letter,
  //     area,
  //     perimeter,
  //     numberOfSides,
  //     cost,
  //     costDiscounted,
  //   });
  totalCost += cost;
  totalCostDiscounted += costDiscounted;
}

console.log({ totalCost, totalCostDiscounted });
