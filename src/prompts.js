const inquirer = require('inquirer');
const { LANG, LANG_LIST } = require('./constant');

async function getProject() {
    try {
        while (true) {
            const { project } = await inquirer.prompt([
                { type: 'input', message: '请输入项目名称：', name: 'project' }
            ]);

            if (project === 'q') {
                return Promise.reject('quit!');
            } else if (project) {
                return project;
            }
        }
    } catch (e) {
        return Promise.reject(e);
    }
}

async function getLanguage() {
    try {
        const { lang } = await inquirer.prompt([{
            type: 'list',
            name: 'lang',
            message: '请选择开发语言',
            choices: LANG_LIST.map(l => {
                return {
                    name: l,
                    value: l
                }
            }),
            default: 'javascript'
        }]);

        return lang;
    } catch (e) {
        return Promise.reject(e);
    }
}

module.exports = {
    getProject,
    getLanguage
};