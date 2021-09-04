import inquirer from 'inquirer';
import { StateManagements, Envs } from './constants';
import { DevEnv, StateManagement } from './interface';

interface Answers {
    projectName: string;
    env: DevEnv;
    stateManagement: StateManagement;
}

export class Question {
    public async run(): Promise<Answers> {
        try {
            return await inquirer.prompt([
                {
                    type: 'input',
                    message: 'please input project name',
                    name: 'projectName',
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
                    choices: StateManagements
                }
            ]);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}
