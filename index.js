#!/usr/bin/env node

const { Command } = require('commander');
const package = require('./package.json');
const { getProjectInformation } = require('./src/prompts');
const { downloadRepo } = require('./src/download');
const ora = require('ora');
const { updatePackageJson } = require('./src/updatePackageJson');

const program = new Command();

program
    .option('-v, --version', 'print react-cli version')
    .option('-i, --init', 'create react project')
    .parse(process.argv);

const options = program.opts();

if (options.version) {
    console.info(package.version);
} else if (options.init) {
    init();
}

async function init() {
    const loading = ora('download repo');
    try {
        const { project, lang } = await getProjectInformation();
        loading.text = '创建项目中...';
        loading.color = 'green';
        loading.start();
        await downloadRepo('HuiWang111/utils', './' + project);
        loading.stop();
        console.info('项目创建成功！');
        updatePackageJson(project);
    } catch (e) {
        loading.stop();
        console.error(e);
    }
}

