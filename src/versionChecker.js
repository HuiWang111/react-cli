const chalk = require('chalk');

const getRemoteVersion = async (pkg) => {
    let res
    try {
      res = await fetch(`http://registry.npmjs.org/${pkg}/latest`).then(result => result.json())
    } catch (e) {
      return
    }
    return res.version
}

const versionToNumber = (version) => {
    return Number(version.replace(/\./g, ''))
}

const versionChecker = async (pkg, localVersion) => {
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

module.exports = versionChecker