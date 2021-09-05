#!/usr/bin/env node --experimental-json-modules
import argsParser from 'yargs-parser';
import fs from 'fs';
import path from 'path';
import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import { getCmdAndOptions } from './utils';
import { createReactProject } from './create';
import pkg from '../package.json';

const args = argsParser(process.argv.slice(2));

function printHelp() {
    console.info(
        fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf-8')
    );
}

function printVersion() {
    console.info(pkg.version);
}

function main() {
    const { command, options } = getCmdAndOptions(args);

    if (command) {
        clear()
        console.info(
            chalk.yellow(figlet.textSync(
                'setup react env',
                { horizontalLayout: 'full' }
            ))
        );

        if (command === 'create') {
            createReactProject(path.join(__dirname, '../templetes'));
        } else if (command === 'install') {
            
        }
    } else if (options.help) {
        printHelp();
    } else if (options.version) {
        printVersion();
    }
}

main();
