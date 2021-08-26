import { downloadRepo } from './download.js';
import { updateProjectPackageJson } from './updatePackageJson.js';
import fs from 'fs';
import execa from 'execa';

export const createDOMProject = async (
    loading,
    project,
    projectPath,
    branch
) => {
    try {
        loading.text = 'creating project...';
        loading.color = 'green';
        loading.start();
        await downloadRepo(`HuiWang111/react-ts-templete#${branch}`, projectPath);
        loading.stop();
        console.info('created !!!');
    
        // 更新模板的package.json的name字符
        updateProjectPackageJson(projectPath);
    
        // 删除README.md
        fs.unlinkSync(projectPath + '/README.md');
    
        console.info('install dependencies');
        // 安装依赖 & 生成dll文件
        await execa('npm', ['ci'], {
            cwd: projectPath,
            stdio: [2, 2, 2]
        });
        // TODO: fix run dll报错
        // await execa('npm', ['run', 'dll'], {
        //     cwd: projectPath,
        //     stdio: [2, 2, 2]
        // });
        console.info('installed !!!');
        console.info('')
        console.info('------------------------------------------------------');
        console.info(`运行 cd ${project} && npm run dll && npm start 启动项目`);
        console.info('------------------------------------------------------');
    } catch (e) {
        loading.stop();
        console.error(e);
    }
}