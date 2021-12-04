import { writeFileSync } from 'fs'
import { join } from 'path'
import { View } from './view'

export class NativeView extends View {
    constructor(fileName: string) {
        super(fileName)
    }

    private get _templete() {
        return `import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Button } from 'rn-element'
import { useAppContext, useMount } from '@/hooks'

export const ${this._fileNameCamel}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <View>
            <Text>${this._fileNameCamel}</Text>
        </View>
    )
})

`
    }

    public async generate() {
        const directory = await this._selectDirectory()

        writeFileSync(
            join(process.cwd(), 'src/views', directory, `${this._fileNameCamel}.tsx`),
            this._templete
        )
    
        console.info(`view ${this._fileNameCamel} is already generated!`)
    }
}