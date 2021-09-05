import fs from 'fs';
import path from 'path';
import execa from 'execa';
import ora from 'ora';
import { StateManagement, Project } from '../interface';
import { copyDir } from '../../utils';

export class ReactDOMProject implements Project {
    private cwd: string;
    private name: string;
    private stateManagement: StateManagement;
    private sourceDir: string;
    private templeteName: string;

    constructor(
        cwd: string,
        name: string,
        stateManagement: StateManagement,
        templeteDir: string
    ) {
        this.cwd = cwd;
        this.name = name;
        this.stateManagement = stateManagement;
        this.templeteName = `react-ts-${this.stateManagement.toLowerCase()}-webpack`;
        this.sourceDir = path.join(templeteDir, this.templeteName);
    }

    private updatePackageJson() {
        const fullName = path.join(this.cwd, 'package.json');

        if (fs.existsSync(fullName)) {
            const json = fs.readFileSync(fullName).toString();
            const data = JSON.parse(json);
            data.name = this.name;
            fs.writeFileSync(fullName, JSON.stringify(data, null, 4));
        } else {
            console.warn(`package.json not found in ${this.cwd}`);
        }
    }

    public async create(): Promise<void> {
        try {
            const spinner = ora(`clone ${this.templeteName} templete...`).start();
            await copyDir(this.sourceDir, this.cwd);
            
            this.updatePackageJson();
            
            spinner.text = 'start install dependencies';
            spinner.stop();
            
            await execa('npm', ['ci'], {
                cwd: this.cwd,
                stdio: [2, 2, 2]
            });
            
            console.info('');
            console.info('------------------------------------------------------');
            console.info(`运行 cd ${this.name} && npm run dll && npm start 启动项目`);
            console.info('------------------------------------------------------');
        } catch(e) {
            console.error(e);
        }
    }
}