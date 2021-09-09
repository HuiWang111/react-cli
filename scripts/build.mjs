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
