#!/usr/bin/env node

import { Command } from 'commander';
import { getProjectInformation } from './src/prompts.js';
import { downloadRepo } from './src/download.js';
import ora from 'ora';
import { updateProjectPackageJson } from './src/updatePackageJson.js';
import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { versionChecker } from './src/versionChecker.js';
import pkg from './package.json';
import execa from 'execa';
import { StateManagementMapBranch } from './src/constant.js';

const program = new Command();

program
    .option('-v, --version', 'print react-cli version')
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
        const { project, stateManagement } = await getProjectInformation();
        const projectPath = path.join(process.cwd(), project);
        const branch = StateManagementMapBranch[stateManagement];

        loading.text = '创建项目中...';
        loading.color = 'green';
        loading.start();
        await downloadRepo(`HuiWang111/react-ts-templete#bizfocus/${branch}`, projectPath);
        loading.stop();
        console.info('项目创建成功！');

        // 更新模板的package.json的name字符
        updateProjectPackageJson(projectPath);

        // 删除README.md
        fs.unlinkSync(projectPath + '/README.md');

        console.info('开始安装依赖')
        // 安装依赖 & 生成dll文件
        await execa('npm', ['ci'], {
            cwd: projectPath,
            stdio: [2, 2, 2]
        });
        await execa('npm', ['run', 'dll'], {
            cwd: projectPath,
            stdio: [2, 2, 2]
        });
        console.info('依赖安装完成！');
        console.info('')
        console.info('---------------------------------------')
        console.info(`运行 cd ${project} && npm start 启动项目`)
        console.info('---------------------------------------')

        // 检查版本是否有更新
        versionChecker(pkg.name, pkg.version)
    } catch (e) {
        loading.stop();
        console.error(e);
    }
}

function printVersion() {
    console.info(pkg.version);
    versionChecker(pkg.name, pkg.version);
}

