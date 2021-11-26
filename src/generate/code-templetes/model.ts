import { upperFirst } from '../../utils'

export default function createModel(fileName: string): string {
    const className = upperFirst(fileName)

    return `import { I${className} } from '../types'

export class ${className} implements I${className} {
    constructor() {
        
    }
}

    `
}
