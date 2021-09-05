import inquirer from 'inquirer';
import { StateManagements, Platforms } from './constants';
import { Platform, StateManagement } from './interface';

interface Answers {
    projectName: string;
    platform: Platform;
    stateManagement: StateManagement;
}

export class Question {
    public async ask(): Promise<Answers> {
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
                    name: 'platform',
                    message: 'select platform',
                    choices: Platforms
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
