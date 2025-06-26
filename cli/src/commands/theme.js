#!/usr/bin/env node

import { Command } from "commander";
import kleur from "kleur";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { request } from "node:https";
import { request as httpRequest } from "node:http";
import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const log = {
    info: (msg) => console.log(kleur.blue(msg)),
    warn: (msg) => console.log(kleur.yellow().bold(msg)),
    error: (msg) => console.error(kleur.red().bold(msg)),
    success: (msg) => console.log(kleur.green().bold(msg)),
};

export function initializeTheme(program) {
    const theme = program.command("theme").description("Theme operations");

    theme
        .command("publish <file>")
        .description("Publish a CSS theme file")
        .option("--name <themeName>", "Theme name (defaults to filename)")
        .option("--publisher <publisher>", "Optional publisher name")
        .option("--prod", "Use production API endpoint", false)
        .action(async (file, options) => {
            let css;
            try {
                css = readFileSync(file, "utf8");
            } catch (err) {
                log.error(`Failed to read file: ${file}`);
                process.exit(1);
            }

            const themeName = options.name || basename(file, ".css");
            const payload = JSON.stringify({
                name: themeName,
                css,
                publisher: options.publisher || undefined,
            });

            const isProd = options.prod === true;
            const hostname = isProd ? "ui.aidan-neel.com" : "localhost";
            const port = isProd ? 443 : 5173;
            const path = "/api/themes/publish";
            const useHttps = isProd;

            const reqFn = useHttps ? request : httpRequest;

            const req = reqFn(
                {
                    hostname,
                    port,
                    path,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(payload),
                    },
                },
                (res) => {
                    let body = "";
                    res.on("data", (chunk) => (body += chunk));
                    res.on("end", () => {
                        if (res.statusCode === 200) {
                            log.success("Theme published successfully.");
                        } else {
                            log.error(
                                `Server error ${res.statusCode}: ${body}`
                            );
                            process.exit(1);
                        }
                    });
                }
            );

            req.on("error", (err) => {
                log.error("Request failed");
                console.error(err);
                process.exit(1);
            });

            req.write(payload);
            req.end();
        });

    theme
        .command("get <name>")
        .description("Download a published theme by name")
        .option("--prod", "Use production API endpoint", false)
        .action(async (name, options) => {
            const isProd = options.prod === true;
            const hostname = isProd ? "ui.aidan-neel.com" : "localhost";
            const port = isProd ? 443 : 5173;
            const pathUrl = `/api/themes/name/${name}`;
            const useHttps = isProd;

            const reqFn = useHttps ? request : httpRequest;

            const req = reqFn(
                {
                    hostname,
                    port,
                    path: pathUrl,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                (res) => {
                    let body = "";
                    res.on("data", (chunk) => (body += chunk));
                    res.on("end", () => {
                        if (res.statusCode === 200) {
                            const parsed = JSON.parse(body);
                            if (!parsed.css) {
                                log.error(
                                    "Invalid theme response (missing CSS)"
                                );
                                process.exit(1);
                            }

                            const outDir = path.resolve("src/lib/ui/themes");
                            const outPath = path.join(outDir, `${name}.css`);
                            mkdirSync(outDir, { recursive: true });
                            writeFileSync(outPath, parsed.css, "utf8");

                            log.success(
                                `Theme "${name}" downloaded to ${outPath}`
                            );
                        } else {
                            log.error(
                                `Server error ${res.statusCode}: ${body}`
                            );
                            process.exit(1);
                        }
                    });
                }
            );

            req.on("error", (err) => {
                log.error("Request failed");
                console.error(err);
                process.exit(1);
            });

            req.end();
        });
}
