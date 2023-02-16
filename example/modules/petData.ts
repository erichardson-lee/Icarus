// deno-lint-ignore-file require-await
import { ModuleBuilder } from "../../mod.ts";

export type Pet = {
  id: string;
  name: string;
  type: "🐈" | "🐕" | "🐇";
};

export const petDataModule = new ModuleBuilder("petData").build(() => {
  const petDataStore = new Map<string, Pet>();

  return {
    async list(): Promise<Pet[]> {
      return (Array.from(petDataStore.values()));
    },

    async get(id: string): Promise<Pet | undefined> {
      return petDataStore.get(id);
    },

    /** @returns The previous value for that ID */
    async set(id: string, pet: Pet): Promise<Pet | undefined> {
      const previousValue = petDataStore.get(id);
      petDataStore.set(id, pet);
      return previousValue;
    },

    async delete(id: string): Promise<boolean> {
      return petDataStore.delete(id);
    },
  };
});
