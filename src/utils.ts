import downloadGitRepo from 'download-git-repo';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import ncp from 'ncp';
import { Command } from './interface';

export function getCmdAndOptions(args: Record<string, any> & { _?: Array<string> }): {
    command: Command,
    options: Omit<Record<string, any>, '_'>
} {
    const command: Command = args['_']?.[0] as Command;
    
    if (command && command !== 'create' && command !== 'install') {
        throw new Error("setup-react-env command must be in ['create', 'install']");
    }
    delete args['_'];

    return { command, options: { ...args } };
}

export function download(repoUrl: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        downloadGitRepo(repoUrl, path, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export function writeFileAndPrint(
    fileName: string,
    content: Buffer | string,
    cwd: string,
    spinner?: ora.Ora
) {
    const fullName = path.join(cwd, fileName);
    let printContent: string;

    if (fs.existsSync(fullName)) {
        fs.writeFileSync(fullName, content);
        printContent = `write file: ${fullName}`;
    } else {
        printContent = `not found file: ${fullName}`;
    }

    if (spinner) {
        spinner.text = printContent;
    } else {
        console.info(printContent);
    }
}

export function copyDir(srcDir: string, destDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ncp(srcDir, destDir, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}