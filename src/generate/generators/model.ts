import { writeFileSync } from 'fs'
import { join } from 'path'
import { upperFirst, toCamelCase } from '../../utils'

export class Model {
    private _fileName: string
    private _absolutePath: string

    constructor(fileName: string, absolutePath: string) {
        this._fileName = fileName
        this._absolutePath = absolutePath
    }

    private get _templete() {
        const className = upperFirst(toCamelCase(this._fileName))

        return `import { I${className} } from '${this._absolutePath}types/index'

export class ${className} implements I${className} {
    constructor() {
        
    }
}

`
    }

    public generate() {
        const filePath = `src/models/${this._fileName}.ts`

        writeFileSync(
            join(process.cwd(), filePath),
            this._templete
        )
        
        console.info('')
        console.info(`${filePath} is already generated!`)
    }
}
