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
        writeFileSync(
            join(process.cwd(), `src/stores/${this._fileName}.ts`),
            this._templete
        )
    
        console.info(`store ${this._fileName} is already generated!`)
    }
}
