import { writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import inquirer from 'inquirer'

export class Style {
    private _fileName: string

    constructor(fileName: string) {
        this._fileName = fileName
    }

    private get _templete() {
        return `import { StyleSheet, Dimensions } from 'react-native'

const { height, width } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        width,
        height
    }
})
`
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

    public async generate() {
        const directory = await this._selectDirectory()

        writeFileSync(
            join(process.cwd(), 'src/views', directory, `${this._fileName}.ts`),
            this._templete
        )
    
        console.info(`style ${this._fileName} is already generated!`)
    }
}
