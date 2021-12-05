import inquirer from 'inquirer'
import { join } from 'path'
import { statSync, readdirSync } from 'fs'

export abstract class SelectDirectory {
    private _root: string

    constructor(root: string) {
        this._root = root
    }

    protected async _recursiveSelect(
        dir: string,
        head: '.' | null = null,
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

            if (selected === '.') {
                return acc
            } else {
                const fullPath = join(dir, selected)
                if (readdirSync(fullPath).some(c => statSync(join(fullPath, c)).isDirectory())) {
                    acc += '/' + selected
                    return this._recursiveSelect(fullPath, '.', acc)
                } else {
                    return acc + '/' + selected
                }
            }
        } catch(e) {
            console.error(e)
        }
    }

    protected _selectDirectory(): Promise<string> {
        return this._recursiveSelect(this._root) as Promise<string>
    }
}