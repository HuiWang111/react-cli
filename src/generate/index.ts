import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { toCamel } from '../utils'

export async function generate(command: string[]) {
    const [func, fileName] = command
    
    if (func === 'module') {
        for (const f of ['view', 'store', 'model', 'api', 'style']) {
            await generateFunc(f, fileName)
        }
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
    fileName = isView ? toCamel(fileName) : fileName
    
    const projectType = getProjectType()
    const { default: createMethod } = await import(`./code-templetes/${func}${isView ? '.' + projectType : ''}.ts`)
    const content = createMethod(fileName)
    writeFileSync(
        join(process.cwd(), `src/${func}s/${fileName}.${isView ? 'tsx' : 'ts'}`),
        content
    )

    console.info(`${func} ${fileName} is already generated!`)
}