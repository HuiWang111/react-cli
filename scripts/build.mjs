import esbuild from 'esbuild';
import pkg from '../package.json';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: ['node12'],
    external: [
        ...Object.keys(pkg.dependencies),
        '/package.json'
    ],
    outfile: 'bin/index.js',
    loader: {
        '.ts': 'ts'
    }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.writeFileSync(
    path.join(__dirname, '../bin/help.txt'),
    fs.readFileSync(path.join(__dirname, '../src/help.txt'))
);

const codeTempletesdir = path.join(__dirname, '../src/generate/code-templetes')
const codeTempletes = fs.readdirSync(codeTempletesdir)

for (const templete of codeTempletes) {
    const ext = path.extname(templete)
    const filename = templete.replace(new RegExp(ext), '')
    
    esbuild.buildSync({
        entryPoints: [path.join(codeTempletesdir, templete)],
        bundle: true,
        platform: 'node',
        target: ['node12'],
        external: [
            ...Object.keys(pkg.dependencies),
            '/package.json'
        ],
        outfile: `bin/code-templetes/${filename}.js`,
        loader: {
            '.ts': 'ts'
        }
    });
}
