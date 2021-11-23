import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export async function generate(command: string[]) {
    const [func, fileName] = command;
    const { default: createMethod } = await import(`./code-templetes/${func}.ts`)
    const content = createMethod(fileName)
    // writeFileSync(
    //     join(process.cwd(), `src/${func}s/${fileName}.ts`),
    //     content
    // )
}
