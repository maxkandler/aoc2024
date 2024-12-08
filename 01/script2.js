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

let similarity = 0;

for (let i = 0; i < left.length; i++) {
  const l = left[i];

  const occurrences = right.filter((r) => r === l).length;

  console.log(l, occurrences)

  similarity += Math.abs(l * occurrences);
}

console.log(similarity);
