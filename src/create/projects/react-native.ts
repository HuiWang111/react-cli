import fs from 'fs';
import path from 'path';
import execa from 'execa';
import ora from 'ora';
import rimraf from 'rimraf';
import { Project } from '../interface';
import { writeFileAndPrint, copyDir } from '../../utils';

export class ReactNativeProject implements Project {
    private cwd: string;
    private name: string;
    private sourceDir: string;
    private templeteName: string;

    constructor(
        cwd: string,
        name: string,
        templeteDir: string
    ) {
        this.cwd = cwd;
        this.name = name;
        this.templeteName = 'react-native-mobx';
        this.sourceDir = path.join(templeteDir, this.templeteName);
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
        const toRewriteFiles = ['.eslintrc.js', '.eslintignore', 'babel.config.js', 'tsconfig.json', 'index.js'];

        for (const file of toRewriteFiles) {
            writeFileAndPrint(
                file,
                fs.readFileSync(path.join(this.sourceDir, file)),
                this.cwd,
                spinner
            );
        }
        spinner.stop();
    }

    private async copyDirs(): Promise<void> {
        try {
            const dirs = ['src', 'scripts'];
    
            for (const dir of dirs) {
                const srcFullName = path.join(this.sourceDir, dir);
                const destFullName = path.join(this.cwd, dir);
                await copyDir(srcFullName, destFullName);
            }
        } catch(e) {
            console.error(e);
        }
    }

    public async create(): Promise<void> {
        const spinner = ora(`react native init ${this.name}...`).start();

        try {
            await execa(`react-native init ${this.name} --template react-native-template-typescript`);
            spinner.stop();

            console.info('install dependencies');
            await this.installDependencies();
            
            console.info('install dev dependencies');
            await this.installDevDependencies();
            
            this.removeFiles();
            this.rewriteFiles();

            spinner.text = 'copy files....';
            spinner.start();
            this.copyDirs();
            spinner.stop();
        } catch(e) {
            spinner.stop();
            console.error(e);
        }
    }
}
