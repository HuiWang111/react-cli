import { upperFirst } from '../../utils'

export default function createModel(fileName: string): string {
    return `
export class ${upperFirst(fileName)} {
    constructor() {
        
    }
}

    `
}
