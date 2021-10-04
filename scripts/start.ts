import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import execa from 'execa';

const templetesDir = path.join(process.cwd(), 'templetes');
const templetesName = fs.readdirSync(templetesDir);

async function start() {
    const { templete } = await inquirer.prompt([
        {
            type: 'list',
            name: 'templete',
            message: 'Which template do you want to start',
            choices: templetesName
        }
    ]);

    await execa('npm', ['start'], {
        cwd: path.join(templetesDir, templete),
        stdio: [2, 2, 2]
    });
}

start();
