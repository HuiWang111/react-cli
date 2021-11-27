import esbuild from 'esbuild';
import pkg from '../package.json';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function copyHelps(__dirname) {
    const helpsDir = path.join(__dirname, '../src/helps')
    const helps = fs.readdirSync(helpsDir)
    
    for (const help of helps) {
        fs.writeFileSync(
            path.join(__dirname, `../bin//helps/${help}`),
            fs.readFileSync(path.join(__dirname, `../src/helps/${help}`))
        );
    }
}

function copyCodeTempletes(__dirname) {
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
}

function build() {
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
    copyHelps(__dirname)
    copyCodeTempletes(__dirname)
}

build()
