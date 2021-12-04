import {
    Api,
    Model,
    Store,
    Style,
    DOMView,
    NativeView
} from './generators'
import { getProjectType } from './utils'
import { isCamelCase } from '../utils'

export async function generate(command: string[]) {
    const [type, fileName] = command

    if (isCamelCase(fileName)) {
        console.error('do not use camelCase, please use snake_case or kebab-case')
        return
    }
    
    const projectType = getProjectType()
    const absolutePath = projectType === 'native' ? '@/' : ''
    
    switch (type) {
        case 'api': {
            (new Api(fileName, absolutePath)).generate()
            break
        }
        case 'model': {
            (new Model(fileName, absolutePath)).generate()
            break
        }
        case 'store': {
            (new Store(fileName)).generate()
            break
        }
        case 'style': {
            if (projectType !== 'native') {
                console.error('your projectType should be `native`')
            } else {
                (new Style(fileName)).generate()
            }
            break
        }
        case 'view': {
            if (!projectType) {
                console.error('package.json not include field `projectType`!')
            } else if (projectType === 'native') {
                (new NativeView(fileName)).generate()
            } else {
                (new DOMView(fileName)).generate()
            }
            break
        }
        default:
            console.error('type is not correct!!!')
    }
}
