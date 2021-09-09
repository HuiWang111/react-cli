import argsParser from 'yargs-parser';
import fs from 'fs';
import path from 'path';
import { Version } from 'ks-script-utils';
import pkg from '../package.json';

const args = argsParser(process.argv.slice(2));

pkg.version = Version.generateNewVersion(pkg.version, args);

console.info(`current version is: ${pkg.version}`);

fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(pkg, null, '\t')
);
