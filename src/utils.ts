import fs from 'fs';
import ora from 'ora';
import path from 'path';
import ncp from 'ncp';

const COMMANDS = ['create', 'generate', 'publish']

export function getCmdAndOptions(args: Record<string, any> & { _?: Array<string> }): {
    command: string[] | undefined,
    options: Omit<Record<string, any>, '_'>
} {
    const command: string[] | undefined = args['_'];
    
    if (command && command.length > 0 && !COMMANDS.includes(command[0])) {
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

export function toCamelCase(str: string) {
    const indexes = str.split('').reduce((arr: number[], a: string, i: number): number[] => {
        if (/(-|_)/.test(a)) {
            arr.push(i)
        }
        return arr
    }, []).map(i => i + 1)
    
    return str.split('').map((a: string, i: number) => {
        if (indexes.includes(i)) {
            return a.toUpperCase()
        }
        return a
    }).join('').replace(/(-|_)/g, '')
}

export function isUpperCase(letter: string) {
    return letter.toUpperCase() === letter
}

export function isCamelCase(str: string) {
    return str.slice(1).split('').some(isUpperCase)
        && str.indexOf('-') < 0
        && str.indexOf('_') < 0
}
