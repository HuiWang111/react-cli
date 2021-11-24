import { upperFirst } from '../../utils'

export default function createDomPage(fileName: string): string {
    return `import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext, useMount } from '../../../hooks'

export const ${upperFirst(fileName)}: FC = observer(() => {
    const { store, api } = useAppContext()
    
    useMount(() => {
        // mounted
    })
    
    return (
        <div>
            ${fileName}
        </div>
    )
})

    `
}
