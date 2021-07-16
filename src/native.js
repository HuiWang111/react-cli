import execa from 'execa';
import fs from 'fs';
import path from 'path';
import { NativeSourcePath, NativeSourceSrcPath } from './constant.js';
import { rimrafSync } from './rimrafSync.js';
import { downloadRepo } from './download.js';

export const createNativeProject = async (
    loading,
    project,
    projectPath
) => {
    try {
        loading.text = 'downloading templete...';
        loading.start();
        await downloadRepo('HuiWang111/RNTemplete#main', path.join(process.cwd(), '../RNTemplete'));

        loading.text = `react-native init ${project}...`;
        await execa(`npx react-native init ${project} --template react-native-template-typescript`);

        loading.text = 'installing dependencies...';
        await execa(
            'npm',
            [
                'i', 'axios', 'mobx', 'mobx-react-lite', 'moment', 'react-native-elements', 'rn-element', 'react-router-native',
                'react-native-safe-area-context', '@react-native-async-storage/async-storage'
            ],
            {
                cwd: projectPath,
                stdio: [2, 2, 2]
            }
        );
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
                cwd: projectPath,
                stdio: [2, 2, 2]
            }
        );
        
        // fs.rmSync(path.join(projectPath, '__tests__/App-test.tsx'));
        // fs.rmdirSync(path.join(projectPath, '__tests__'));
        rimrafSync(path.join(projectPath, '__tests__'));
        fs.unlinkSync(path.join(projectPath, 'App.tsx'));
        writeFile('.eslintrc.js', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintrc.js')));
        writeFile('.eslintignore', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintignore')));
        writeFile('babel.config.js', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'babel.config.js')));
        writeFile('tsconfig.json', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'tsconfig.json')));

        const src = path.join(process.cwd(), NativeSourceSrcPath);
        const dir = path.join(projectPath, 'src');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        copy(fs.readdirSync(src));
        
        loading.stop();
        console.info('project initialized');

        rimrafSync(path.join(process.cwd(), 'RNTemplete'));
    } catch (e) {
        loading.stop();
        console.error(e);
    }

    function writeFile(file, code) {
        const filePath = path.join(projectPath, file);

        fs.writeFileSync(
            filePath,
            code
        );
        console.info(`writeFile: ${filePath}`);
    }

    function copy(paths, currentPath = path.join(process.cwd(), NativeSourceSrcPath)) {
        const dirPath = currentPath;

        paths.forEach(p => {
            currentPath = path.join(dirPath, p);
            const stat = fs.statSync(currentPath);
            const pathTail = currentPath.split('src')[1].slice(1);

            if (stat.isDirectory()) {
                if (pathTail) {
                    const dir = path.join(projectPath, 'src', pathTail);

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                }
                copy(fs.readdirSync(currentPath), currentPath);
            } else {
                writeFile(
                    path.join('src', pathTail),
                    fs.readFileSync(currentPath)
                );
            }
        });
    }
}