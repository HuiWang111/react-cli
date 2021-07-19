import inquirer from 'inquirer';
import { StateManagement, Envs } from './constant.js';

export async function getProjectInformation() {
    try {
        return await inquirer.prompt([
            {
                type: 'input',
                message: 'please input project name',
                name: 'project',
                validate: function (input) {
                    if (input && input.trim().length) {
                        return true;
                    }
                    return 'project name is required !';
                }
            },
            {
                type: 'list',
                name: 'env',
                message: 'select platform',
                choices: Envs
            },
            {
                type: 'list',
                name: 'stateManagement',
                message: 'select state management',
                choices: StateManagement
            }
        ]);
    } catch (e) {
        return Promise.reject(e);
    }
}