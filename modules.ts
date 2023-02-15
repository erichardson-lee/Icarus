// deno-lint-ignore-file no-explicit-any

export class Module<
  ID extends string,
  Data extends any,
> {
  constructor(public readonly id: ID, public readonly data: Data) {}
}

export type ModuleMap<
  M extends Module<string, any> | ModuleAssembler<string, any, any>,
> = DepMap<M extends ModuleAssembler<string, any, any> ? Assemble<M> : M>;

export type DepMap<Dependencies extends Module<string, any>> = {
  [dep in Dependencies as dep["id"]]: Awaited<dep["data"]>;
};

export type ModuleFn<
  ID extends string,
  Dependencies extends Module<string, any>,
  ModData extends any,
> = (deps: DepMap<Dependencies>) => Promise<Module<ID, ModData>>;

export class ModuleBuilder<
  ID extends string,
  Dependencies extends Module<string, any>,
> {
  public readonly dependencies: Dependencies["id"][] = [];

  constructor(
    public readonly id: ID,
  ) {}

  addDependency<
    M extends Module<string, any> | ModuleAssembler<string, any, any>,
  >(module: M): ModuleBuilder<
    ID,
    | Dependencies
    | (M extends ModuleAssembler<string, any, any> ? Assemble<M> : M)
  > {
    this.dependencies.push(module.id);
    return this;
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
export type Assemble<A extends ModuleAssembler<any, any, any>> = Awaited<
  ReturnType<A["build"]>
>;

export class ModuleAssembler<
  ID extends string,
  Dependencies extends Module<string, any>,
  Builder extends ModuleFn<string, Module<string, any>, any>,
> {
  constructor(
    public readonly id: ID,
    public readonly dependencies: Dependencies["id"][],
    public readonly build: Builder,
  ) {}
}
