import { Module, ModuleAssembler } from "./modules.ts";
import { sort } from "./sort.ts";

function sanitizeId(id: string): string {
  return id.replace(/-/, "");
}

/**
 * Generates a mermaidjs graph showing dependencies, with generated modules
 * using rectangles, and static ones using hexagons
 */
export function diagram<M extends Module | ModuleAssembler>(
  input: M[],
): string {
  const moduleMap = new Map<string, M>(input.map((v) => [v.id, v]));

  const startOrder: string[] = sort(moduleMap, input.values());

  const declarationLines: string[] = [];
  const linkLines: string[] = [];

  for (const moduleId of startOrder) {
    const module = moduleMap.get(moduleId);
    if (!module) throw new Error("Module not found", { cause: moduleId });

    const mid = sanitizeId(moduleId);

    if (module instanceof Module) {
      declarationLines.push(`${mid}{{${module.id}}}`);
    } else if (module instanceof ModuleAssembler) {
      declarationLines.push(`${mid}[${mid}]`);

      if (module.dependencies.length >= 1) {
        linkLines.push(
          `${mid} -->|Depends On| ${
            module.dependencies.map(sanitizeId).join(" & ")
          }`,
        );

        linkLines.push("");
      }
    }
  }

  return [
    "graph BT",
    declarationLines.join("\n"),
    "",
    linkLines.join("\n"),
  ].join("\n");
}
