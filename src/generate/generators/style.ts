import { writeFileSync } from 'fs'
import { join } from 'path'
import { SelectDirectory } from './abstracts/select-directory'

export class Style extends SelectDirectory {
    private _fileName: string

    constructor(fileName: string) {
        super(join(process.cwd(), 'src/views'))

        this._fileName = fileName
    }

    private get _templete() {
        return `import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
`
    }

    public async generate() {
        const directory = await this._selectDirectory()
        const filePath = join('src/views', directory, `${this._fileName}.ts`)

        writeFileSync(
            join(process.cwd(), filePath),
            this._templete
        )
        
        console.info('')
        console.info(`${filePath} is already generated!`)
    }
}
