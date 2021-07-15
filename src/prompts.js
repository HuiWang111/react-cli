import inquirer from 'inquirer';
import { StateManagement, Envs } from './constant.js';

export async function getProjectInformation() {
    try {
        return await inquirer.prompt([
            {
                type: 'input',
                message: '请输入项目名称：',
                name: 'project',
                validate: function (input) {
                    if (input && input.trim().length) {
                        return true;
                    }
                    return 'please input project name';
                }
            },
            {
                type: 'list',
                name: 'env',
                message: '请选择开发环境',
                choices: Envs
            },
            {
                type: 'list',
                name: 'stateManagement',
                message: '请选择状态管理器',
                choices: StateManagement
            }
        ]);
    } catch (e) {
        return Promise.reject(e);
    }
}