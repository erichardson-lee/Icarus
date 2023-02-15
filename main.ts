import { ModuleBuilder, start } from "./mod.ts";
import { Module } from "./modules.ts";

const mod1 = new Module("mod1", { client: "bar" });

const mod2 = new ModuleBuilder("mod2").build(() => {
  return 1234;
});

const mod3 = new ModuleBuilder("mod3")
  .addDependency(mod2)
  .addDependency(mod1)
  .build((deps) => {
    return { val: deps.mod1.client + deps.mod2 * 2 };
  });

const mods = await start([
  mod1,
  mod2,
  mod3,
]);
