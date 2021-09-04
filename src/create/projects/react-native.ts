import fs from 'fs';
import path from 'path';
import execa from 'execa';
import ora from 'ora';
import rimraf from 'rimraf';
import { Project } from '../interface';
import { download, writeFileAndPrint, copyDir } from '../../utils';
import { NativeSourcePath } from '../constants';

export class ReactNativeProject implements Project {
    private cwd: string;
    private projectName: string;

    constructor(
        cwd: string,
        projectName: string
    ) {
        this.cwd = cwd;
        this.projectName = projectName;
    }

    private async reactNativeInit() {
        await execa(`npx react-native init ${this.projectName} --template react-native-template-typescript`, {
            stdio: [2, 2, 2]
        });
    }

    private async installDependencies(): Promise<void> {
        await execa(
            'npm',
            [
                'i',
                'axios',
                'mobx',
                'mobx-react-lite',
                'moment',
                'rn-element',
                'react-router-native',
                'react-native-safe-area-context',
                '@react-native-async-storage/async-storage'
            ],
            {
                cwd: this.cwd,
                stdio: [2, 2, 2]
            }
        );
    }

    private async installDevDependencies(): Promise<void> {
        await execa(
            'npm',
            [
                'i',
                '@types/react',
                '@types/react-router-native',
                '@babel/plugin-proposal-decorators',
                'eslint-plugin-spellcheck',
                '--save-dev'
            ],
            {
                cwd: this.cwd,
                stdio: [2, 2, 2]
            }
        );
    }

    private removeFiles() {
        rimraf.sync(path.join(this.cwd, '__tests__'));
        fs.unlinkSync(path.join(this.cwd, 'App.tsx'));
    }

    private rewriteFiles() {
        const spinner = ora('start rewrite files').start();

        writeFileAndPrint(
            '.eslintrc.js',
            fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintrc.js')),
            this.cwd,
            spinner
        );
        writeFileAndPrint(
            '.eslintignore',
            fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintignore')),
            this.cwd,
            spinner
        );
        writeFileAndPrint(
            'babel.config.js',
            fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'babel.config.js')),
            this.cwd,
            spinner
        );
        writeFileAndPrint(
            'tsconfig.json',
            fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'tsconfig.json')),
            this.cwd,
            spinner
        );
        writeFileAndPrint(
            'index.js',
            fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'index.js')),
            this.cwd,
            spinner
        );
    }

    private async copyDirs(): Promise<void> {
        try {
            const dirs = ['src', 'scripts'];
    
            for (const dir of dirs) {
                const srcFullName = path.join(process.cwd(), NativeSourcePath, dir);
                const destFullName = path.join(process.cwd(), dir);
                await copyDir(srcFullName, destFullName);
            }
        } catch(e) {
            console.error(e);
        }
    }

    public async create(): Promise<void> {
        const spinner = ora('templete downloading').start();

        try {
            await download('HuiWang111/RNTemplete#main', path.join(process.cwd(), NativeSourcePath));

            spinner.text = `react native init ${this.projectName}\n`;
            await this.reactNativeInit();
            spinner.succeed(`react native init ${this.projectName}\n`);

            spinner.text = 'install dependencies\n';
            await this.installDependencies();  
            spinner.succeed('install dependencies\n');
            
            spinner.text = 'install dev dependencies\n';
            await this.installDevDependencies();
            spinner.succeed('install dev dependencies\n');
            
            this.removeFiles();
            this.rewriteFiles();
            this.copyDirs();

            rimraf.sync(path.join(process.cwd(), NativeSourcePath));
            spinner.stop();
        } catch(e) {
            spinner.stop();
            console.error(e);
        }
    }
}
