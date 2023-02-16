import { Node, sort } from "./sort.ts";

BenchAmount(100, 30);
BenchAmount(0, 5);
BenchAmount(10e0, 5);
BenchAmount(10e1, 5);
BenchAmount(10e2, 5);
BenchAmount(10e3, 5);
BenchAmount(10e4, 5);

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

function BenchAmount(numberOfItems: number, depCount: number) {
  const nodeIds = new Set<string>();
  const nodes = <Node[]> [];

  for (let i = 0; i < numberOfItems; i++) {
    const id = `node-${i}`;
    nodeIds.add(id);
    nodes[i] = { id };

    const deps = new Set<string>();

    for (let j = 0; j < depCount; j++) {
      const ranInt = randInt(i);
      if (ranInt >= i) continue;
      deps.add(`node-${ranInt}`);
    }

    nodes[i].dependencies = Array.from(deps.values());
  }

  shuffle(nodes);

  Deno.bench(
    `Sort ${numberOfItems} items [${depCount} dependencies]`,
    () => {
      const order = sort(nodeIds, nodes.values());

      if (order.length !== nodeIds.size) {
        throw new Error("Invalid Sort");
      }
    },
  );
}

// Credit to:
// https://stackoverflow.com/a/2450976
// MUTATES ARRAY
function shuffle<A>(a: A[]): A[] {
  let currentIndex = a.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = randInt(currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]];
  }

  return a;
}
