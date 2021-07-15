import execa from 'execa';
import fs from 'fs';
import path from 'path';
import { NativeSourcePath, NativeSourceSrcPath } from './constant.js';

export const createNativeProject = async (
    loading,
    project,
    projectPath
) => {
    try {
        loading.text = `react-native init ${project}...`;
        loading.color = 'green';
        loading.start();
        await execa(`npx react-native init ${project} --template react-native-template-typescript`);
        loading.stop();
        console.info(`react-native init ${project} complete`);

        console.info('开始安装依赖');
        await execa(
            'npm',
            [
                'i', 'axios', 'mobx', 'mobx-react-lite', 'moment', 'react-native-elements', 'rn-element', 'react-router-native'
            ],
            {
                cwd: projectPath,
                stdio: [2, 2, 2]
            }
        );
        await execa(
            'npm',
            ['i', '@types/react', 'babel-plugin-module-resolver', '@types/react-router-native', '--save-dev'],
            {
                cwd: projectPath,
                stdio: [2, 2, 2]
            }
        );
        console.info('依赖安装完成！');
        
        console.info('开始整理项目结构');
        fs.rmSync(path.join(projectPath, '__tests__/App-test.tsx'));
        fs.rmdirSync(path.join(projectPath, '__tests__'));
        fs.unlinkSync(path.join(projectPath, 'App.tsx'));
        writeFile('.eslintrc.js', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintrc.js')));
        writeFile('.eslintignore', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintignore')));
        // babel.config
        // tsconfig

        const src = path.join(process.cwd(), NativeSourceSrcPath);
        const dir = path.join(projectPath, 'src');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        copy(fs.readdirSync(src));
        
        console.info('项目结构整理完成');
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