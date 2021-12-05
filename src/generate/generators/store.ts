import { writeFileSync } from 'fs'
import { join } from 'path'
import { upperFirst,  toCamelCase } from '../../utils'

export class Store {
    private _fileName: string

    constructor(fileName: string) {
        this._fileName = fileName
    }

    private get _templete() {
        return `import { action, observable, makeObservable } from 'mobx'

export class ${upperFirst(toCamelCase(this._fileName))}Store {
    constructor() {
        makeObservable(this)
    }
}

`
    }

    public generate() {
        const filePath = `src/stores/${this._fileName}.ts`

        writeFileSync(
            join(process.cwd(), filePath),
            this._templete
        )
        
        console.info('')
        console.info(`${filePath} is already generated!`)
    }
}
