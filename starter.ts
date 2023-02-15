// deno-lint-ignore-file no-explicit-any
import {
  DepMap,
  Module,
  ModuleAssembler,
  ModuleFn,
  ModuleMap,
} from "./modules.ts";
import { sort } from "./sort.ts";
type AnyModule = Module<string, any>;
type AnyAssembler = ModuleAssembler<
  string,
  AnyModule,
  ModuleFn<string, AnyModule, any>
>;

export async function start<
  M extends
    | AnyModule
    | AnyAssembler,
>(...input: M[]): Promise<ModuleMap<M>> {
  const moduleMap: Record<string, AnyModule> = {};

  const moduleIdSet = new Set<string>();
  const assemblersMap = new Map<string, AnyAssembler>();

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
    const assembler = assemblersMap.get(id);
    if (!assembler) continue;

    const deps: DepMap<AnyModule> = assembler.dependencies.map((id) =>
      moduleMap[id]
    );

    moduleMap[assembler.id] = await assembler.build(deps);
  }

  return moduleMap as ModuleMap<M>;
}