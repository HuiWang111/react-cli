import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { toCamel, upperFirst } from '../utils'

export async function generate(command: string[]) {
    const [func, fileName] = command
    
    if (func === 'module') {
        // for (const f of ['view', 'store', 'model', 'api', 'style']) {
        //     await generateFunc(f, fileName)
        // }
    } else {
        generateFunc(func, fileName)
    }
}

function getProjectType(): string {
    const json = readFileSync(join(process.cwd(), 'package.json')).toString()
    const data = JSON.parse(json)
    return data.projectType
}

async function generateFunc(func: string, fileName: string): Promise<void> {
    const isView = func === 'view'
    const fileNameCamel = upperFirst(toCamel(fileName));
    
    const projectType = getProjectType()

    if (isView && !projectType) {
        console.error('package.json not includes field `projectType`!')
        return
    }
    
    const isStyle = func === 'style'
    if (isStyle && projectType === 'dom') {
        return
    }

    const { default: createMethod } = await import(`./code-templetes/${func}${isView ? '.' + projectType : ''}.js`)
    const content = createMethod(fileNameCamel)
    writeFileSync(
        join(process.cwd(), `src/${isStyle ? 'view' : func}s/${isView ? fileNameCamel : fileName}.${isView ? 'tsx' : 'ts'}`),
        content
    )

    console.info(`${func} ${isView ? fileNameCamel : fileName} is already generated!`)
}