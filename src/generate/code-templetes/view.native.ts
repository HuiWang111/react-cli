import { upperFirst } from '../../utils'

export default function createNativePage(fileName: string): string {
    return `import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Button } from 'rn-element'
import { useAppContext, useMount } from '../../../hooks'

export const ${upperFirst(fileName)}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <View>
            <Text>${fileName}</Text>
        </View>
    )
})

    `
}
