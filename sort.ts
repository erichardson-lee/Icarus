/**
 * based on the following psuedocode from wikipedia
 * ```
 * L ← Empty list that will contain the sorted nodes
 * while exists nodes without a permanent mark do
 *     select an unmarked node n
 *     visit(n)
 *
 * function visit(node n)
 *     if n has a permanent mark then
 *         return
 *     if n has a temporary mark then
 *         stop   (graph has at least one cycle)
 *
 *     mark n with a temporary mark
 *
 *     for each node m with an edge from n to m do
 *         visit(m)
 *
 *     remove temporary mark from n
 *     mark n with a permanent mark
 *     add n to head of L
 * ```
 */
export function sort(
  idSet: Set<string>,
  data: IterableIterator<{ id: string; dependencies: string[] }>,
): string[] {
  type Node = { id: string; afters: string[]; mark?: "temp" | "perm" };
  const unmarkedNodes = new Set<string>();
  const nodes = new Map<string, Node>();
  const sorted: Node[] = [];

  const setupNodeIfNotExists = (id: string) => {
    if (!nodes.has(id)) {
      unmarkedNodes.add(id);
      nodes.set(id, { id, afters: [] });
    }
  };

  for (const value of data) {
    setupNodeIfNotExists(value.id);
    for (const dep of value.dependencies) {
      if (!idSet.has(dep)) {
        throw new Error(`Dependency not found '${dep} for layer '${value.id}'`);
      }
      setupNodeIfNotExists(dep);
      nodes.get(dep)?.afters.push(value.id);
    }
  }
  for (const unmarkedNode of unmarkedNodes.values()) {
    visit(unmarkedNode);
  }

  function visit(id: string) {
    const node = nodes.get(id);
    if (!node) throw new Error("Node not found: " + id);
    if (node.mark === "perm") return;
    if (node.mark === "temp") throw new Error("Cycle Detected");

    node.mark = "temp";

    for (const after of node.afters) {
      visit(after);
    }

    node.mark = "perm";
    unmarkedNodes.delete(node.id);

    sorted.push(node);
  }

  return sorted
    .map(({ id }) => id)
    .filter((d): d is string => typeof d === "string")
    .reverse();
}
