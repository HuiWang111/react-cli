import { upperFirst } from '../../utils'

export default function createApi(fileName: string): string {
    return `import { AxiosInstance } from 'axios'
import { AppStore } from '../stores'

export class ${upperFirst(fileName)}Api {
    constructor(
        private httpClient: AxiosInstance,
        private store: AppStore
    ) {}
}

    `
}
