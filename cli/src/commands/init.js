#!/usr/bin/env node

import { Command } from "commander";
import kleur from "kleur";
import { Listr } from "listr2";
import path from "node:path";
import process from "node:process";
import { existsSync } from "node:fs";
import inquirer from "inquirer";
import fs from "node:fs";
import { json } from "node:stream/consumers";
import dependencies from "../../registry/config/dependencies.json" with { type: "json" };
import { execSync } from 'node:child_process';

export function initializeInit(program) {
    const log = {
        info: (msg) => console.log(kleur.blue(msg)),
        warn: (msg) => console.log(kleur.yellow().bold(msg)),
        error: (msg) => console.error(kleur.red().bold(msg)),
        success: (msg) => console.log(kleur.green().bold(msg)),
    };

    program
        .command("init")
        .description("initialize project")
        .option("--cwd <path>", "Working directory", process.cwd())
        .option("--silent", "Suppress output", false)
        .action(async (opts) => {
            try {
                const cwd = path.resolve(opts.cwd || process.cwd());

                if (!existsSync(cwd)) {
                    log.error(`Directory ${kleur.cyan(cwd)} does not exist.`);
                    process.exit(1);
                }

                const confirm = await inquirer.prompt([
                    {
                        type: "confirm",
                        name: "proceed",
                        message: kleur.yellow(
                            "Are you in the root of your working Svelte project?"
                        ),
                        default: false,
                    },
                ]);

                if (!confirm.proceed) {
                    log.warn("Operation cancelled.");
                    process.exit(0);
                }

                if (!opts.silent) {
                    log.info(`Initializing at ${kleur.magenta(cwd)}`);
                }

                const tasks = new Listr(
                    [
                        {
                            title: "Setting up directories",
                            task: async () => {
                                const directories = [
                                    "src/lib/ui",
                                    "src/lib/ui/components",
                                    "src/lib/ui/internals",
                                    "src/lib/ui/themes",
                                ];

                                directories.forEach((directory) => {
                                    try {
                                        if (!fs.existsSync(directory)) {
                                            fs.mkdirSync(directory, {
                                                recursive: true,
                                            });
                                        }
                                    } catch (error) {}
                                });
                            },
                        },
                        {
                            title: "Installing required files",
                            task: async () => {
                                const fileMap = {
                                    "./registry/config/ui.css":
                                        "src/lib/ui/ui.css",
                                    "./registry/config/utils.ts":
                                        "src/lib/ui/utils.ts",
                                    "./registry/config/internals/body.ts":
                                        "src/lib/ui/internals/body.ts",
                                    "./registry/config/internals/state.svelte.ts":
                                        "src/lib/ui/internals/state.svelte.ts",
                                    "./registry/config/internals/transition.ts":
                                        "src/lib/ui/internals/transition.ts",
                                    "./registry/config/internals/trigger.ts":
                                        "src/lib/ui/internals/trigger.ts",
                                    "./registry/config/components/internals/background-blur.svelte":
                                        "src/lib/ui/components/internals/background-blur.svelte",
                                    "./registry/themes/default.css":
                                        "src/lib/ui/themes/default.css",
                                };

                                Object.entries(fileMap).forEach(
                                    ([src, dest]) => {
                                        const resolvedSrc = path.resolve(src);
                                        const resolvedDest = path.resolve(dest);
                                        const destDir =
                                            path.dirname(resolvedDest);

                                        fs.mkdirSync(destDir, {
                                            recursive: true,
                                        });

                                        const data = fs.readFileSync(
                                            resolvedSrc,
                                            "utf8"
                                        );
                                        fs.writeFileSync(resolvedDest, data);
                                    }
                                );
                            },
                        },
                        {
                            title: "Installing dependencies",
                            task: async () => {
                                const packageJsonPath = path.resolve("./package.json");

                                if (!fs.existsSync(packageJsonPath)) {
                                  throw new Error("No package.json found in the root directory.");
                                }
                                
                                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                                
                                pkg.dependencies = {
                                  ...(pkg.dependencies || {}),
                                  ...dependencies.dependencies,
                                };
                                
                                fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
                            },
                        },
                    ],
                    {
                        rendererOptions: {
                            collapse: false,
                        },
                    }
                );

                await tasks.run();

                if (!opts.silent) {
                    log.success("Project initialized.");
                }
            } catch (err) {
                log.error("Something went wrong.");
                process.exit(1);
            }
        });
}
