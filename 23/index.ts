import { readFileSync } from "node:fs";

const computerInput = readFileSync("input.txt", "utf8").split("\n");

const parseComputerMap = (input: string[]): Map<string, Set<string>> => {
  const computerMap = new Map<string, Set<string>>();

  for (const computer of computerInput) {
    const [computerA, computerB] = computer.split("-") as [string, string];
    computerMap.set(
      computerA,
      (computerMap.get(computerA) ?? new Set()).add(computerB)
    );
    computerMap.set(
      computerB,
      (computerMap.get(computerB) ?? new Set()).add(computerA)
    );
  }
  return computerMap;
};

const getTriplets = (computerMap: Map<string, Set<string>>): string[][] => {
  const triplets = new Set<string>();
  for (const [computer, connections] of computerMap.entries()) {
    if (connections.size < 2) continue;

    for (const connection of connections) {
      const peer = computerMap.get(connection);
      if (!peer) continue;

      const overlap = peer.intersection(connections);
      if (overlap.size === 0) continue;

      for (const shared of overlap) {
        const triplet = [computer, connection, shared].sort();
        if (triplet.some((name) => name.startsWith("t"))) {
          triplets.add(triplet.join("-"));
        }
      }
    }
  }
  return [...triplets.values()].map((triplet) => triplet.split("-"));
};

const findFullNetworks = (
  computerMap: Map<string, Set<string>>
): Set<string> => {
  const networks = new Set<string>();

  for (let [node, connections] of [...computerMap.entries()]) {
    for (let connection of connections) {
      const matchingNodes = new Set([node, connection]);

      for (let possibleConnection of connections) {
        if (
          matchingNodes
            .values()
            .every((node) => computerMap.get(node)?.has(possibleConnection))
        ) {
          matchingNodes.add(possibleConnection);
        }
      }

      networks.add([...matchingNodes.values()].sort().join(","));
    }
  }

  return networks;
};

const computerMap = parseComputerMap(computerInput);
const triplets = getTriplets(computerMap);
const allNetworks = findFullNetworks(computerMap);

let largestNetwork = "";
for (let network of allNetworks) {
  if (network.length > largestNetwork.length) {
    largestNetwork = network;
  }
}

console.log({
  tripletCount: triplets.length,
  largestNetwork,
});
