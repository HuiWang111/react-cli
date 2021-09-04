import fs from 'fs';
import path from 'path';
import execa from 'execa';
import ora from 'ora';
import { StateManagement, Project } from '../interface';
import { download } from '../../utils';
import { StateManagementMapBranch } from '../constants';

export class ReactDOMProject implements Project {
    private cwd: string;
    private projectName: string;
    private stateManagement: StateManagement;

    constructor(
        cwd: string,
        projectName: string,
        stateManagement: StateManagement
    ) {
        this.cwd = cwd;
        this.projectName = projectName;
        this.stateManagement = stateManagement;
    }

    private updatePackageJson() {
        const fullName = path.join(this.cwd, 'package.json');

        if (fs.existsSync(fullName)) {
            const json = fs.readFileSync(fullName).toString();
            const data = JSON.parse(json);
            data.name = this.projectName;
            fs.writeFileSync(fullName, JSON.stringify(data, null, 4));
        } else {
            console.warn(`package.json not found in ${this.cwd}`)
        }
    }

    public async create(): Promise<void> {
        try {
            const branch = StateManagementMapBranch[this.stateManagement];
            const spinner = ora('templete downloading').start();
            await download(`HuiWang111/react-ts-templete#${branch}`, this.cwd);
            
            this.updatePackageJson();
            
            spinner.text = 'start install dependencies';
            spinner.stop();
            
            await execa('npm', ['ci'], {
                cwd: this.cwd,
                stdio: [2, 2, 2]
            });
            
            console.info('');
            console.info('------------------------------------------------------');
            console.info(`运行 cd ${this.projectName} && npm run dll && npm start 启动项目`);
            console.info('------------------------------------------------------');
        } catch(e) {
            console.error(e);
        }
    }
}