export default function createDomPage(fileName: string): string {
    return `import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext, useMount } from '../hooks'

export const ${fileName}: FC = observer(() => {
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
