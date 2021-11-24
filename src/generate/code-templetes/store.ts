import { upperFirst } from '../../utils'

export default function createStore(fileName: string): string {
    return `import { action, observable, makeObservable } from 'mobx'

export class ${upperFirst(fileName)}Store {
    constructor() {
        makeObservable(this)
    }
}

    `
}
