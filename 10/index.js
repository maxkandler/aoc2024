import { readFileSync } from "fs";
import assert from "assert";

const data = readFileSync("./input.txt", "utf8");
const map = data.split("\n").map((line) => line.split("").map(pos => Number.parseInt(pos)));
const width = map[0].length;
const height = map.length;



const getWalkOptions = (x, y) => {
    const options = [];

    if (x > 0) {
        options.push({ x: x - 1, y });
    }
    if (x< width - 1) {
        options.push({ x: x + 1, y });
    }
    if (y > 0) {
        options.push({ x, y: y - 1 });
    }
    if (y < height - 1) {   
        options.push({ x, y: y + 1 });  
    }

    return options;
}

function walkDown(x, y, height) {
    const newHeight = height - 1;

    if (newHeight === 0) {
        const reachedTrailheads = [];
        for (const option of getWalkOptions(x, y)) {
            if (map[option.y][option.x] === 0) {
                reachedTrailheads.push(`${option.x},${option.y}`);
            }
        }
        return reachedTrailheads;
    }

    const trailHeads = [];

    for (const option of getWalkOptions(x, y)) {
        if (map[option.y][option.x] === newHeight) {
            const walkResult = walkDown(option.x, option.y, newHeight);
            trailHeads.push(...walkResult);
        }
    }

    return trailHeads;
}


const summits = {};

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 9) {
            const walkDownResult = walkDown(x, y, 9)
            summits[`${x},${y}`] = walkDownResult;
        }
    }
}


const trailHeads = {}

for (const heads of Object.values(summits)) {
    const uniqueHeads = [... new Set(heads)];
    for (const head of uniqueHeads) {
        if (!(head in trailHeads)) {
            trailHeads[head] = 0;
        }
        trailHeads[head] = trailHeads[head] + 1;
    }
}

console.log(Object.values(trailHeads).reduce((acc, curr) => acc + curr, 0));

const totalTrailHeads = {}

for (const heads of Object.values(summits)) {
    for (const head of heads) {
        if (!(head in totalTrailHeads)) {
            totalTrailHeads[head] = 0;
        }
        totalTrailHeads[head] = totalTrailHeads[head] + 1;
    }
}

console.log(Object.values(totalTrailHeads).reduce((acc, curr) => acc + curr, 0));
