import { sort } from "./sort.ts";
import { assertEquals } from "https://deno.land/std@0.173.0/testing/asserts.ts";

Deno.test("Sorts dependencies", () => {
  const a = { id: "a", dependencies: [] };
  const b = { id: "b", dependencies: ["a", "d"] };
  const c = { id: "c", dependencies: ["b"] };
  const d = { id: "d", dependencies: ["a"] };

  const ids = new Set(["a", "b", "c", "d"]);

  const sorted = sort(ids, [b, a, c, d].values());
  assertEquals(sorted, ["a", "d", "b", "c"]);
});
