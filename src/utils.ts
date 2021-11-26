import fs from 'fs';
import ora from 'ora';
import path from 'path';
import ncp from 'ncp';

const COMMANDS = ['create', 'generate']

export function getCmdAndOptions(args: Record<string, any> & { _?: Array<string> }): {
    command: string[] | undefined,
    options: Omit<Record<string, any>, '_'>
} {
    const command: string[] | undefined = args['_'];
    
    if (command && !COMMANDS.includes(command[0])) {
        throw new Error(`setup-react-env command must be in [${COMMANDS.join(', ')}]`);
    }
    delete args['_'];

    return { command, options: { ...args } };
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

export function upperFirst(str: string) {
    return `${str[0].toUpperCase()}${str.slice(1)}`
}

export function toCamel(str: string) {
    const indexes = str.split('').reduce((arr: number[], a: string, i: number): number[] => {
        if (a === '-') {
            arr.push(i)
        }
        return arr
    }, []).map(i => i + 1)

    return str.split('').map((a: string, i: number) => {
        if (indexes.includes(i)) {
            return a.toUpperCase()
        }
        return a
    }).join('').replace(/-/g, '')
}
