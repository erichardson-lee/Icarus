// deno-lint-ignore-file no-explicit-any

export class Module<ID extends string = string, Data extends any = any> {
  constructor(public readonly id: ID, public readonly data: Data) {}
}

export type ModuleMap<M extends Module | ModuleAssembler> = DepMap<
  M extends ModuleAssembler ? Assemble<M> : M
>;

export type DepMap<Dependencies extends Module = Module> = {
  [dep in Dependencies as dep["id"]]: Awaited<dep["data"]>;
};

export type ModuleFn<
  ID extends string = string,
  Dependencies extends Module = Module,
  ModData extends any = any,
> = (deps: DepMap<Dependencies>) => Promise<Module<ID, ModData>>;

export class ModuleBuilder<
  ID extends string = string,
  Dependencies extends Module = Module,
> {
  public readonly dependencies: Dependencies["id"][] = [];

  constructor(public readonly id: ID) {}

  addDependency<M extends Module | ModuleAssembler>(module: M): ModuleBuilder<
    ID,
    Dependencies | Assemble<M>
  > {
    this.dependencies.push(module.id);
    return this as ModuleBuilder<ID, Dependencies | Assemble<M>>;
  }

  build<Data>(
    fn: (deps: DepMap<Dependencies>) => Data,
  ): ModuleAssembler<ID, Dependencies, ModuleFn<ID, Dependencies, Data>> {
    return new ModuleAssembler(
      this.id,
      this.dependencies,
      async (deps) => new Module(this.id, await fn(deps)),
    );
  }
}

/** Utility function to get the assembled module from a module assembler */
export type Assemble<A extends Module | ModuleAssembler> = A extends Module ? A
  : A extends ModuleAssembler ? Awaited<ReturnType<A["build"]>>
  : never;

export class ModuleAssembler<
  ID extends string = string,
  Dependencies extends Module = Module,
  Builder extends ModuleFn = ModuleFn,
> {
  constructor(
    public readonly id: ID,
    public readonly dependencies: Dependencies["id"][],
    public readonly build: Builder,
  ) {}
}
