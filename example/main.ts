import { start } from "../mod.ts";
import type { Pet } from "./modules/petData.ts";
import { modules } from "./modules/index.ts";

const data = await start(modules);
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
