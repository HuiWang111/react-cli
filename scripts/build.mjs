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
}

build()
