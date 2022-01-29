import { readdirSync, statSync } from 'fs'
import { join } from 'path'

(async function() {
    const src = join(process.cwd(), 'src')
    const alias = readdirSync(src)
        .filter(a => statSync(join(src, a)).isDirectory())
        .reduce((acc, dir) => {
            acc[dir] = `src/${dir}`
            return acc
        }, {})

    console.info(alias)
})()