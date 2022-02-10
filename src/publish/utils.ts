import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import execa from 'execa'
import { exec } from 'child_process'
import { DEFAULT_CONFIG_FILE } from './contants'
import { GetCustomizedCommandCallback } from './interface'

export function buildApk(): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = execa('gradlew assembleRelease', {
            cwd: join(process.cwd(), 'android')
        })

        proc.stdout?.pipe(process.stdout)

        proc.stderr?.on('data', chunk => {
            reject(chunk)
        })

        proc.stdout?.on('close', () => {
            resolve()
        })
    })
}

function fill(n: number): string {
    return n > 9 ? '' + n : '0' + n
}

export function getYMD() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return {
        year: fill(year),
        month: fill(month),
        day: fill(day)
    }
}

export async function openApkDir() {
    try {
        // windows
        await execa(`explorer ${join(process.cwd(), 'android/app/build/outputs/apk/release').replace(/\//g, '\\')}`)
        return
    } catch(e) {
        // do nothing
    }

    try {
        // macos
        await execa(`open ${join(process.cwd(), 'android/app/build/outputs/apk/release')}`)
        return
    } catch (e) {
        // do nothing
    }
}

export function getCurrentBranch(): Promise<string> {
    return new Promise((resolve, reject) => {
        const proc = exec('git branch', (err) => {
            if (err) {
                reject(err)
            }
        })
        let currentBranch
    
        proc.stdout?.on('data', (chunk) => {
            const branch = chunk.split('\n').find(name => name.includes('*'))

            if (branch) {
                currentBranch = branch.replace('* ', '')
            }
        })
        
        proc.stderr?.on('data', chunk => {
            reject(chunk)
        })

        proc.stdout?.on('close', () => {
            resolve(currentBranch)
        })
    })
}

export function codePush(
    deploymentName: string,
    ownerName: string,
    appName: string,
    messagePrefix: string,
    message: string,
    getCustomizedCommand?: GetCustomizedCommandCallback
): Promise<void> {
    return new Promise((resolve, reject) => {
        let command: string
        if (getCustomizedCommand) {
            command = getCustomizedCommand({
                deploymentName,
                ownerName,
                appName,
                messagePrefix,
                message
            })
        } else {
            command = `appcenter codepush release-react -a ${ownerName}/${appName} -d ${deploymentName} --description "${messagePrefix} ${message}"`
        }
        console.info('')
        console.info('> ' + command)
        const proc = exec(command)
        
        proc.stderr?.on('data', chunk => {
            reject(chunk)
        })

        proc.stdout?.on('close', () => {
            resolve()
        })
        proc.stdout?.pipe(process.stdout)
    })
}

/**
 * 判断代码是否有修改
 */
 export function isCodeUpToDate() {
    return new Promise((resolve, reject) => {
        const proc = exec('git status')
        let content = ''

        proc.stdout?.on('data', (chunk) => {
            content += chunk
        })

        proc.stderr?.on('data', chunk => {
            reject(chunk)
        })

        proc.stdout?.on('close', () => {
            resolve(content.includes('nothing to commit'))
        })
    })
}

export async function cleanCodeChange() {
    try {
        await execa('git checkout .')
    } catch(e) {
        // not a git repository
        // do nothing
    }
}

export async function copyApp(isTest: boolean) {
    const apkPath = join(process.cwd(), 'android/app/build/outputs/apk/release')
    const file = isTest
        ? 'app-release.test.apk'
        : 'app-release.prod.apk'
    const command = `cp ${join(apkPath, 'app-release.apk')} ${join(apkPath, file)}`

    console.info('')
    console.info('> ' + command)
    await execa(command)
}

/**
 * 重写`android/app/build.gradle`文件内容以区分applicationId，目的是为了实现在同一台机器上同时可以安装测试版和正式版
 */
 export async function writeBuildGradleFileByEnv(isTest: boolean, applicationId: string) {
    if (!isTest) {
        return
    }

    const content = await readFile( join(process.cwd(), 'android/app/build.gradle'), { encoding: 'utf-8' })

    await writeFile(
        join(process.cwd(), 'android/app/build.gradle'),
        content.replace(`applicationId "${applicationId}"`, `applicationId "${applicationId}.test"`)
    )
}

export async function writeVersion(
    version: string,
    path: string
) {
    console.info(`current version is: ${version}`)
    console.info('')

    await writeFile(
        join(process.cwd(), path),
        `export const version = '${version}'`
    )
}

export async function writeEnv(env: string, path: string) {
    await writeFile(
        join(process.cwd(), path),
        `export const env = '${env}'`
    )
}

export async function writeAppName(appName: string, toReplaceAppName: string) {
    const filePath = join(process.cwd(), 'android/app/src/main/res/values/strings.xml')
    const content = await readFile(filePath, { encoding: 'utf-8' })

    await writeFile(
        filePath,
        content.replace(toReplaceAppName, appName)  
    )
}

export function getConfigFile(options: Record<string, any>) {
    if (options.config) {
        return join(process.cwd(), options.config)
    }
    return join(process.cwd(), DEFAULT_CONFIG_FILE)
}
