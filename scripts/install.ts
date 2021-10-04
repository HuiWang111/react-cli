import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import execa from 'execa';

const templetesDir = path.join(process.cwd(), 'templetes');
const templetesName = fs.readdirSync(templetesDir);

async function install() {
    const { templete } = await inquirer.prompt([
        {
            type: 'list',
            name: 'templete',
            message: 'Which template do you want to install node_modules',
            choices: templetesName.concat('all')
        }
    ]);

    if (templete === 'all') {
        for (const tempName of templetesName) {
            await execa('npm i', {
                cwd: path.join(templetesDir, tempName),
                stdio: [2, 2, 2]
            });
        }
    } else {
        await execa('npm', ['i'], {
            cwd: path.join(templetesDir, templete),
            stdio: [2, 2, 2]
        });
    }
}

install();
