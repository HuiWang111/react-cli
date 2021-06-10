#!/usr/bin/env node

const { Command } = require('commander');
const package = require('./package.json');
const { getProjectInformation } = require('./src/prompts');
const { downloadRepo } = require('./src/download');
const ora = require('ora');
const { updateProjectPackageJson } = require('./src/updatePackageJson');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet')
const fs = require('fs')
const versionChecker = require('./src/versionChecker')
const pkg = require('./package.json')
const execa = require('execa')

const program = new Command();

program
    .option('-v, --version', 'print react-cli version')
    .option('-i, --init', 'create react project')
    .parse(process.argv);

const options = program.opts();

if (options.version) {
    console.info(package.version);
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
        const { project, lang } = await getProjectInformation();
        const projectPath = process.cwd() + '/' + project;

        loading.text = '创建项目中...';
        loading.color = 'green';
        loading.start();
        await downloadRepo('HuiWang111/react-ts-templete#main', projectPath);
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

