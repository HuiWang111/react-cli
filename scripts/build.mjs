import esbuild from 'esbuild';
import pkg from '../package.json';

esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: ['node12'],
    external: [...Object.keys(pkg.dependencies)],
    outfile: 'bin/index.js',
    loader: {
        '.ts': 'ts'
    }
});
