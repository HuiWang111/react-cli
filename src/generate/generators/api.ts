import { writeFileSync } from 'fs'
import { join } from 'path'
import { upperFirst, toCamelCase } from '../../utils'

export class Api {
    private _fileName: string
    private _absolutePath: string

    constructor(fileName: string, absolutePath: string) {
        this._fileName = fileName
        this._absolutePath = absolutePath
    }

    private get _templete() {
        return `import { AxiosInstance } from 'axios'

export class ${upperFirst(toCamelCase(this._fileName))}Api {
    constructor(private httpClient: AxiosInstance) {}
}

`
    }

    public generate() {
        const filePath = `src/apis/${this._fileName}.ts`

        writeFileSync(
            join(process.cwd(), filePath),
            this._templete
        )
        
        console.info('')
        console.info(`${filePath} is already generated!`)
    }
}
