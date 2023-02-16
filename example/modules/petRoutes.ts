import { ModuleBuilder } from "../../modules.ts";
import { fastifyModule } from "./fastifyModule.ts";
import { Pet, petDataModule } from "./petData.ts";

export const petRoutesModule = new ModuleBuilder("pet-routes")
  .addDependency(fastifyModule)
  .addDependency(petDataModule)
  .build(({ fastify, petData }) => {
    fastify.get(
      "/",
      () => petData.list(),
    );

    fastify.get<{ Params: { id: string } }>(
      "/:id",
      (req) => petData.get(req.params.id),
    );

    fastify.put<{ Params: { id: string }; Body: Pet }>(
      "/:id",
      (req) => petData.set(req.params.id, req.body),
    );

    fastify.delete<{ Params: { id: string } }>(
      "/:id",
      (req) => petData.delete(req.params.id),
    );
  });
