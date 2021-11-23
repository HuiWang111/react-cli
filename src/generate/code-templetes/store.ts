import { upperFirst } from '../../utils'

export default function createStore(fileName: string): string {
    return `import { observable, action } from 'mobx'

export class ${upperFirst(fileName)}Store {
    
}
    `
}