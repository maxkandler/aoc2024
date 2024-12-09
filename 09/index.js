import { readFileSync } from "fs";
import assert from "assert";

const data = readFileSync("./input.txt", "utf8").split("");

const convertToArray = (data) => {
    const filledArray = [];
    let fileIndex = 0;
    for (let i = 0; i < data.length; i++) {
        const length = parseInt(data[i]);

        if (i % 2 === 0) {
            filledArray.push(...Array(length).fill(fileIndex));
            fileIndex++;
        } else {
            if (length === 0) {
                continue;
            }
            filledArray.push(...Array(length).fill('.'));
        }

    }
    return filledArray;
}

const defrag1 = (data) => {
    const input = [...data];
    const numberOfFilled = input.filter((item) => item !== '.').length;

    const compactedArray = [];

    for (let i = 0; i < numberOfFilled; i++) {

        if (input[i] !== '.') {
            compactedArray.push(input[i]);
            continue;
        }

        let j;
        while (j = input.pop()) {
            if (j !== '.') {
                compactedArray.push(j);
                break;
            }
        }

    }

    return compactedArray;
}

const defrag2 = (data) => {
    const input = [...data];
    const result = [...data];

    let count = 0;
    let previousInput = undefined;

    for (let i = (input.length - 1); i >= 0; i--) {
        let currentInput = input[i];

        if (previousInput !== undefined && previousInput !== currentInput && previousInput !== '.') {
            let emptySpaces = 0;

            for (let j = 0; j <= i; j++) {
                if (result[j] === '.') {
                    emptySpaces++;
                } else {
                    emptySpaces = 0;
                }

                if (emptySpaces == count) {
                    for (let k = j; k > (j - emptySpaces); k--) {
                        result[k] = previousInput;
                    }
                    for (let k = (i + 1); k <= (i + count); k++) {
                        result[k] = '.';
                    }
                    break;
                }
            }

            count = 0;
        }
        previousInput = currentInput;

        if (currentInput === '.') {
            count = 0;
        } else {
            count++;
        }
    }

    return result;
}

const getChecksum = (array) => {
    let checksum = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] === '.') {
            continue;
        }
        checksum += array[i] * i;
    }

    return checksum;
}


const input2 = convertToArray("2333133121414131402".split(""));
assert(getChecksum(defrag1(input2)) === 1928);
assert(getChecksum(defrag2(input2)) === 2858);
assert(defrag2(input2).join('') === "00992111777.44.333....5555.6666.....8888..");


const fileArray = convertToArray(data);
console.log(getChecksum(defrag1(fileArray)))

const result = defrag2(fileArray);
const checksum = getChecksum(result);
console.log(checksum)

