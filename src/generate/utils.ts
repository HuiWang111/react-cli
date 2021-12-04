import { readFileSync } from 'fs'
import { join } from 'path'

export function getProjectType(): string {
    const json = readFileSync(join(process.cwd(), 'package.json')).toString()
    const data = JSON.parse(json)
    return data.projectType
}
