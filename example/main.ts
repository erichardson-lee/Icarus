import { start } from "../starter.ts";
import { fastifyModule } from "./fastifyModule.ts";
import type { Pet } from "./petData.ts";
import { petRoutesModule } from "./petRoutes.ts";

const data = await start([
  fastifyModule,

  // Added before dependency in the list (it doesn't matter)
  petRoutesModule,

  // Dynamic import example
  (await import("./petData.ts")).petDataModule,
]);
console.log("Done Loading Modules");

// Example of using module return values after starting
const addPet = (pet: Omit<Pet, "id">): void => {
  const id = crypto.randomUUID().slice(0, 8);
  data.petData.set(id, { id, ...pet });
};

addPet({
  name: "tilly",
  type: "🐕",
});

addPet({
  name: "cisco",
  type: "🐈",
});

addPet({
  name: "stephan",
  type: "🐇",
});

data.fastify.listen({ port: 3000 }).then((addr) => {
  console.log("Listening on Address:", addr);
});
