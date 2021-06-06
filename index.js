#!/usr/bin/env node

const { Command } = require('commander');
const package = require('./package.json');
const { getProject, getLanguage } = require('./src/prompts');

const program = new Command();

program
    .option('-v, --version', 'print react-cli version')
    .option('--init', 'create react project')
    .parse(process.argv);

const options = program.opts();

if (options.version) {
    console.info(package.version);
} else if (options.init) {
    init();
}

async function init() {
    try {
        const project = await getProject();
        const lang = await getLanguage();
        console.log(project, lang);
    } catch (e) {
        console.error(e);
    }
}

