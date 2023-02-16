import { Module, ModuleAssembler } from "../../mod.ts";

import { fastifyModule } from "./fastifyModule.ts";
import { petDataModule } from "./petData.ts";
import { petRoutesModule } from "./petRoutes.ts";

export const modules = [
  fastifyModule,
  petDataModule,
  petRoutesModule,
] satisfies (Module | ModuleAssembler)[];
