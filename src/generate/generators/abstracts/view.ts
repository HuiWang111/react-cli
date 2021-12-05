import { toCamelCase, upperFirst } from '../../../utils'
import { SelectDirectory } from './select-directory'
import { join } from 'path'

export abstract class View extends SelectDirectory {
    protected _fileName: string
    protected _fileNameCamel: string
    protected _absolutePath: string

    constructor(fileName: string) {
        super(join(process.cwd(), 'src/views'))

        this._fileName = fileName
        this._fileNameCamel = upperFirst(toCamelCase(fileName));
    }
} 