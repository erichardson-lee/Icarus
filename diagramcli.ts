import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { diagram } from "./diagrammer.ts";
import { Module, ModuleAssembler } from "./modules.ts";

if (!import.meta.main) {
  console.error("Do not import this file, it must be ran directly");
  Deno.exit(1);
}

const diagramRegex = /```mermaid MODULE_DIAGRAM\n[^(```)]*```/s;

function assertModuleArray(
  modList: unknown,
): asserts modList is (Module | ModuleAssembler)[] {
  if (!Array.isArray(modList)) {
    throw new Error("Not an array");
  }
  if (
    modList.some((v) =>
      !(v instanceof Module) &&
      !(v instanceof ModuleAssembler)
    )
  ) {
    throw new Error("Must only contain Modules and Module Assemblers");
  }
}

await new Command()
  .name("Diagram Generator")
  .description("Generates diagrams, and inserts them into markdown files")
  .version("v1.0.0")
  .command("generate <module>")
  .description("Generate a diagram, and update a markdown file")
  .option("-m, --markdown <markdown>", "The markdown file to insert into.", {
    default: "README.md",
  })
  .option("-e, --export <export>", "the name of the module array export.", {
    default: "modules",
  })
  .action(async (opts, modules) => {
    console.log("Running", opts, modules);
    const { newReadMe, readMe } = await genReadMe(modules, opts);

    if (newReadMe !== readMe) {
      // Changed
      await Deno.writeTextFile(opts.markdown, newReadMe);
    } else {
      console.log("Already up to date");
    }
  })
  .command("validate <module>")
  .description("Generate a diagram, and validate a markdown file")
  .option("-m, --markdown <markdown>", "The markdown file to insert into.", {
    default: "README.md",
  })
  .option("-e, --export <export>", "the name of the module array export.", {
    default: "modules",
  })
  .action(async (opts, modules) => {
    console.log("Running", opts, modules);
    const { newReadMe, readMe } = await genReadMe(modules, opts);

    if (newReadMe !== readMe) {
      // Changed
      console.error(
        "Not all diagrams are up to date, rerun diagram generation",
      );
      Deno.exit(1);
    } else {
      console.log("All Diagrams are OK");
      Deno.exit(0);
    }
  })
  .parse();

async function genReadMe(
  modules: string,
  opts: { markdown: string; export: string },
) {
  const mod = new URL(modules, `file://${Deno.cwd()}/`).toString();
  const fullMod = await import(mod).catch((err: Error) => {
    if (err.message.startsWith("Cannot find module")) {
      console.error(err.message);
      console.error("This may be caused by using npm modules");
      Deno.exit(1);
    } else {
      console.error("Error Loading Modules:", err?.message ?? err);
      Deno.exit(1);
    }
  });
  const modList = fullMod[opts.export];

  assertModuleArray(modList);

  const mermaidDiagram = "```mermaid MODULE_DIAGRAM\n" +
    diagram(modList) +
    "```";

  const readMe = await Deno.readTextFile(opts.markdown);

  const hasBlocks = diagramRegex.test(readMe);
  if (!hasBlocks) {
    console.error(
      "You must have at least one code block starting with '```mermaid MODULE_DIAGRAM' for the diagram to go in to",
    );
    Deno.exit(1);
  }

  const newReadMe = readMe.replace(diagramRegex, mermaidDiagram);
  return { newReadMe, readMe };
}
