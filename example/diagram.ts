import { diagram } from "../mod.ts";
import { fastifyModule } from "./fastifyModule.ts";
import { petRoutesModule } from "./petRoutes.ts";
import { petDataModule } from "./petData.ts";

Deno.writeTextFileSync(
  "./README.md",
  [
    "# Example Project",
    "",
    "```mermaid",
    diagram([
      fastifyModule,
      petRoutesModule,
      petDataModule,
    ]),
    "```",
  ].join("\n"),
);
