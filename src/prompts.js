const inquirer = require('inquirer');
const { LANG_LIST } = require('./constant');

async function getProjectInformation() {
    try {
        return await inquirer.prompt([
            {
                type: 'input',
                message: '请输入项目名称：',
                name: 'project',
                validate: function(input) {
                    if (input && input.trim().length) {
                        return true;
                    }
                    return 'please input project name';
                }
            },
            // {
            //     type: 'rawlist',
            //     name: 'lang',
            //     message: '请选择开发语言',
            //     choices: LANG_LIST
            // }
        ]);
    } catch (e) {
        return Promise.reject(e);
    }
}

module.exports = {
    getProjectInformation
};