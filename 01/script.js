import { readFileSync } from 'node:fs';

const lines = readFileSync('./input.txt', 'utf-8').split('\n');
console.log(lines);
const left = [];
const right = [];

for (const line of lines) {
  const [l, r] = line.split('   ');
  left.push(Number.parseInt(l, 10));
  right.push(Number.parseInt(r, 10));
}
left.sort()
right.sort()

console.log(left, right)

let totalDistance = 0;

for (let i = 0; i < left.length; i++) {
  const r = right[i];
  const l = left[i];

  console.log(r, l, Math.abs(r - l));

  totalDistance += Math.abs(r - l);
}

console.log(totalDistance);
