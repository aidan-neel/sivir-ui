#!/usr/bin/env node

import { Command } from "commander";
import { initializeAdd } from "./commands/add.js";
import { initializeInit } from "./commands/init.js";
import { initializeTheme } from "./commands/theme.js";

const program = new Command();
program
    .name("@aidan-neel/ui")
    .description("CLI for installing @aidan-neel/ui components")
    .version("0.1.0");

initializeAdd(program);
initializeInit(program);
initializeTheme(program);

program.parse();
