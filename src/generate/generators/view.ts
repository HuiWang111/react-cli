import { toCamelCase, upperFirst } from '../../utils'
import inquirer from 'inquirer'
import { join } from 'path'
import { statSync, readdirSync } from 'fs'

export class View {
    protected _fileName: string
    protected _fileNameCamel: string
    protected _absolutePath: string

    constructor(fileName: string) {
        this._fileName = fileName
        this._fileNameCamel = upperFirst(toCamelCase(fileName));
    }

    private async _recursiveSelect(
        dir: string,
        head: './' | null = null,
        acc = ''
    ): Promise<string | undefined> {
        let children = readdirSync(dir).filter(c => statSync(join(dir, c)).isDirectory())
        if (head) {
            children = [head, ...children]
        }
        
        try {
            const { selected } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selected',
                    message: 'select directory',
                    choices: children
                }
            ]);

            if (selected === './') {
                return acc
            } else {
                const fullPath = join(dir, selected)
                if (readdirSync(fullPath).some(c => statSync(join(fullPath, c)).isDirectory())) {
                    acc += '/' + selected
                    return this._recursiveSelect(fullPath, './', acc)
                } else {
                    return acc + '/' + selected
                }
            }
        } catch(e) {
            console.error(e)
        }
    }

    protected _selectDirectory(): Promise<string> {
        return this._recursiveSelect(join(process.cwd(), 'src/views')) as Promise<string>
    }
} 