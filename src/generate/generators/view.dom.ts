import { writeFileSync } from 'fs'
import { join } from 'path'
import { View } from './abstracts/view'

export class DOMView extends View {
    constructor(fileName: string) {
        super(fileName)
    }

    private get _templete() {
        return `import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext, useMount } from 'hooks'

export const ${this._fileNameCamel}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <div>
            ${this._fileNameCamel}
        </div>
    )
})

`
    }

    public async generate() {
        const directory = await this._selectDirectory()
        const filePath = join('src/views', directory, `${this._fileNameCamel}.tsx`)

        writeFileSync(
            join(process.cwd(), filePath),
            this._templete
        )
        
        console.info('')
        console.info(`${filePath} is already generated!`)
    }
}
