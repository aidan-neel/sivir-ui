#!/usr/bin/env node

import { Command } from "commander";
import kleur from "kleur";
import { Listr } from "listr2";
import path from "node:path";
import process from "node:process";
import { existsSync } from "node:fs";

export function initializeAdd(program) {
    const log = {
        info: (msg) => console.log(kleur.blue(msg)),
        warn: (msg) => console.log(kleur.yellow().bold(msg)),
        error: (msg) => console.error(kleur.red().bold(msg)),
        success: (msg) => console.log(kleur.green().bold(msg)),
    };

    const availableComponents = [
        "alert-dialog",
        "alert",
        "badge",
        "button",
        "card",
        "checkbox",
        "input",
        "modal",
        "popover",
        "skeleton",
        "toast",
    ];

    program
        .command("add [components...]")
        .description("add command")
        .option("--cwd <path>", "Working directory", process.cwd())
        .option("--silent", "Suppress output", false)
        .action(async (componentsArg, opts) => {
            try {
                const cwd = path.resolve(opts.cwd || process.cwd());

                if (!existsSync(cwd)) {
                    log.error(`Directory ${kleur.cyan(cwd)} does not exist.`);
                    process.exit(1);
                }

                if (!opts.silent) {
                    log.info(`Starting installation at ${kleur.magenta(cwd)}`);
                }

                let components;
                if (componentsArg.length === 1 && componentsArg[0] === "*") {
                    components = availableComponents;
                } else {
                    components = componentsArg.filter((name) =>
                        availableComponents.includes(name)
                    );
                }

                if (components.length === 0) {
                    log.warn("No valid components specified.");
                    process.exit(0);
                }

                const tasks = new Listr(
                    components.map((name) => ({
                        title: `Installing ${name}`,
                        task: async () => {
                            await new Promise((r) => setTimeout(r, 400));
                        },
                    })),
                    {
                        rendererOptions: { collapse: false },
                    }
                );

                await tasks.run();

                if (!opts.silent) {
                    log.success("All components installed.");
                }
            } catch (err) {
                log.error("Something went wrong.");
                process.exit(1);
            }
        });
}
