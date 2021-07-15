#!/usr/bin/env node

import { Command } from 'commander';
import { getProjectInformation } from './src/prompts.js';
import ora from 'ora';
import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import path from 'path';
import { versionChecker } from './src/versionChecker.js';
import pkg from './package.json';
import { StateManagementMapBranch } from './src/constant.js';
import { createDOMProject } from './src/dom.js';
import { createNativeProject } from './src/native.js';

const program = new Command();

program
    .option('-v, --version', 'print setup-react-env version')
    .option('-i, --init', 'create react project')
    .parse(process.argv);

const options = program.opts();

if (options.version) {
    printVersion();
} else if (options.init) {
    clear()
    console.info(
        chalk.yellow(figlet.textSync(
            'setup react env',
            { horizontalLayout: 'full' }
        ))
    );
    init();
}

async function init() {
    const loading = ora('download repo');
    try {
        const { project, env, stateManagement } = await getProjectInformation();
        const projectPath = path.join(process.cwd(), project);
        const branch = StateManagementMapBranch[stateManagement];

        if (env === 'React-DOM') {
            await createDOMProject(
                loading,
                project,
                projectPath,
                branch
            );
        } else if (env === 'React-Native') {
            createNativeProject(
                loading,
                project,
                projectPath
            );
        }

        // 检查版本是否有更新
        versionChecker(pkg.name, pkg.version)
    } catch (e) {
        console.error(e);
    }
}

function printVersion() {
    console.info(pkg.version);
    versionChecker(pkg.name, pkg.version);
}

