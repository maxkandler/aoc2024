import { readFileSync } from 'node:fs';

const lines = readFileSync('./input.txt', 'utf-8').split('\n');

const allIncreasing = (numbers) => {
    let currentNumber = 0;
    for (const number of numbers) {
        if (number > currentNumber) {
            currentNumber = number;
        } else {
            return false;
        }
    }
    return true;
}

const allDecreasing = (numbers) => {
    let currentNumber = Number.MAX_SAFE_INTEGER;
    for (const number of numbers) {
        if (number < currentNumber) {
            currentNumber = number;
        } else {
            return false;
        }
    }
    return true;
}

const diffSmallerThree = (numbers) => {
    for (let i = 0; i < numbers.length - 1; i++) {
        if ((i+1) < numbers.length && Math.abs(numbers[i + 1] - numbers[i]) > 3) {
            return false;
        }
    }
    return true;
}


let safeReports = 0;
const unsafeReports = [];
for (const line of lines) {
    const values = line.split(' ').map(number => Number.parseInt(number, 10));
    if ((allIncreasing(values) || allDecreasing(values)) && diffSmallerThree(values)) {
        safeReports++;
    } else {
        unsafeReports.push(values);
    }
}

console.log('correct reports: ', safeReports);

for (const report of unsafeReports) {
    for (let i = 0; i < report.length; i++) {
        const newReport = [...report];
        newReport.splice(i, 1);
        if ((allIncreasing(newReport) || allDecreasing(newReport)) && diffSmallerThree(newReport)) {
            safeReports++;
            break;
        }
    }
}

console.log('correct reports after fix: ', safeReports);
