import chalk from 'chalk';
import axios from 'axios';

const getRemoteVersion = async (pkg) => {
    let res
    try {
      res = await axios.get(`http://registry.npmjs.org/${pkg}/latest`);
    } catch (e) {
      return
    }
    return res.data.version;
}

const versionToNumber = (version) => {
    return Number(version.replace(/\./g, ''));
}

export const versionChecker = async (pkg, localVersion) => {
    const remoteVersion = await getRemoteVersion(pkg);

    if (!remoteVersion) return;

    if (versionToNumber(remoteVersion) > versionToNumber(localVersion)) {
        console.info('')
        console.info('------------------------------------------')
        console.info(chalk.yellow(`Package update available：${localVersion} => ${remoteVersion}`))
        console.info('------------------------------------------')
        console.info('')
    }
}