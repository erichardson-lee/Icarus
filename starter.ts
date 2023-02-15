import { DepMap, Module, ModuleAssembler, ModuleMap } from "./modules.ts";
import { sort } from "./sort.ts";

export async function start<
  M extends Module | ModuleAssembler,
>(input: M[]): Promise<ModuleMap<M>> {
  const moduleMap: Record<string, Module["data"]> = {};

  const moduleIdSet = new Set<string>();
  const assemblersMap = new Map<string, ModuleAssembler>();

  for (const item of input) {
    moduleIdSet.add(item.id);

    if (item instanceof Module) {
      moduleMap[item.id] = item.data;
    } else if (item instanceof ModuleAssembler) {
      assemblersMap.set(item.id, item);
    } else {
      throw new SyntaxError("Non Module/ModuleAssembler in start", {
        cause: item,
      });
    }
  }

  const startOrder: string[] = sort(moduleIdSet, assemblersMap.values());

  for (const id of startOrder) {
    console.log("Starting Module:", id);
    const assembler = assemblersMap.get(id);
    if (!assembler) {
      console.log("Static Module, skipping");
      continue;
    }

    const deps: DepMap = Object.fromEntries(
      assembler.dependencies.map((id) => [id, moduleMap[id]]),
    );

    moduleMap[assembler.id] = (await assembler.build(deps)).data;
  }

  return moduleMap as ModuleMap<M>;
}
