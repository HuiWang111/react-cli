/**
 * 由于reat-native版本不够稳定，因此写这个脚本以便于版本有所更新时及时得到通知。
 * 防止错过多个版本的更新以至于一旦更新会对项目产生过大的风险。
 */
import { execSync } from 'child_process'
import pkg from '../package.json'
import chalk from 'chalk'

function fetchRemoteVersion(packageName) {
    try {
        const version = execSync(`npm view ${packageName} version`).toString()
        return Promise.resolve(version.replace('\n', ''))
    } catch (e) {
        console.error(e)
        return Promise.reject(e)
    }
}

function isNotSameVersion(v1, v2) {
    const [major1, minor1, patch1] = v1.split('.')
    const [major2, minor2, patch2] = v2.split('.')

    return patch1 !== patch2 || minor1 !== minor2 || major1 !== major2
}

async function main() {
    const RN = 'react-native'

    try {
        const remoteVersion = await fetchRemoteVersion(RN)
        const localVersion = pkg.dependencies[RN]
        console.info('')
        if (isNotSameVersion(remoteVersion, localVersion.replace('^', ''))) {
            console.warn(
                chalk.yellow(
                    `The latest version of ${RN} is ${remoteVersion}, but local version is ${localVersion}, Please update it timely.\nto see https://reactnative.dev/blog get changelog`
                )
            )
        } else {
            console.info(
                chalk.green(`The version of ${RN} is up to date`)
            )
        }
    } catch (e) {
        console.error(
            chalk.red(`check ${RN} version error: ${e.message}`)
        )
    }
}

main()