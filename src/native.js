import execa from 'execa';
import fs from 'fs';
import path from 'path';
import { NativeSourcePath, NativeSourceSrcPath, NativeSourceScriptsPath } from './constant.js';
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
        await downloadRepo('HuiWang111/RNTemplete#main', path.join(process.cwd(), NativeSourcePath));

        loading.text = `react-native init ${project}...`;
        await execa(`npx react-native init ${project} --template react-native-template-typescript`);
        loading.stop();
        
        await execa(
            'npm',
            [
                'i',
                'axios',
                'mobx',
                'mobx-react-lite',
                'moment',
                'react-native-elements',
                'rn-element',
                'react-router-native',
                'react-native-safe-area-context',
                '@react-native-async-storage/async-storage'
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

        rimrafSync(path.join(projectPath, '__tests__'));
        fs.unlinkSync(path.join(projectPath, 'App.tsx'));
        writeFile('.eslintrc.js', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintrc.js')));
        writeFile('.eslintignore', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, '.eslintignore')));
        writeFile('babel.config.js', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'babel.config.js')));
        writeFile('tsconfig.json', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'tsconfig.json')));
        writeFile('index.js', fs.readFileSync(path.join(process.cwd(), NativeSourcePath, 'index.js')));
        updatePackageJSON(path.join(projectPath, 'package.json'));

        const src = path.join(process.cwd(), NativeSourceSrcPath);
        const scripts = path.join(process.cwd(), NativeSourceScriptsPath);
        ['src', 'scripts'].forEach(dirname => {
            const dir = path.join(projectPath, dirname);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
        copy(fs.readdirSync(scripts), scripts, 'scripts');
        copy(fs.readdirSync(src), src, 'src');

        loading.stop();
        console.info('project initialized');

        rimrafSync(path.join(process.cwd(), NativeSourcePath));
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

    function copy(paths, currentPath, separator) {
        const dirPath = currentPath;

        paths.forEach(p => {
            currentPath = path.join(dirPath, p);
            const stat = fs.statSync(currentPath);
            const pathTail = currentPath.split(separator)[1].slice(1);

            if (stat.isDirectory()) {
                if (pathTail) {
                    const dir = path.join(projectPath, separator, pathTail);

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                }
                copy(fs.readdirSync(currentPath), currentPath, separator);
            } else {
                writeFile(
                    path.join(separator, pathTail),
                    fs.readFileSync(currentPath)
                );
            }
        });
    }

    function updatePackageJSON(pkgFile) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgFile).toString());
            pkg.scripts.start = "npm run check-version && react-native start";
            pkg.scripts['check-version'] = "node --experimental-json-modules scripts/checkDepsVersion.mjs";
            fs.writeFileSync(
                pkgFile,
                JSON.stringify(pkg, "", "\t")
            );
        } catch (e) {
            console.error(e);
        }
    }
}