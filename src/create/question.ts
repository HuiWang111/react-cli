import inquirer from 'inquirer';
import { readdir } from 'fs/promises';
import { join } from 'path';

interface Answers {
    projectName: string;
    templete: string;
}

export class Question {
    private _templetes: string[]

    public async getTempletes(templeteDir: string): Promise<void> {
        try {
            const templetesName = await readdir(templeteDir)
            this._templetes = templetesName.filter(name => name !== 'react-ts-redux-webpack')
        } catch(e) {
            console.error(e)
        }
    }

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
                    name: 'templete',
                    message: 'select templete',
                    choices: this._templetes
                }
            ]);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}
