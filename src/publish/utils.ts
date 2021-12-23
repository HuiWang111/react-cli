import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import execa from 'execa'
import { exec } from 'child_process'

export function buildApk() {
    return new Promise((resolve) => {
        const proc = execa('gradlew assembleRelease', {
            cwd: join(process.cwd(), 'android')
        })

        proc.stdout?.pipe(process.stdout)

        proc.stdout?.on('close', () => {
            resolve(null)
        })
    })
}

export function getYMD() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return {
        year,
        month,
        day
    }
}

export async function openApkDir() {
    try {
        await execa(`explorer ${join(process.cwd(), 'android/app/build/outputs/apk/release').replace(/\//g, '\\')}`)
    } catch (e) {
        // do nothing
    }
}

export function getCurrentBranch(): Promise<string> {
    return new Promise((resolve, reject) => {
        const proc = exec('git branch')
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

export async function codePush(
    useAppcenter: boolean,
    deploymentKey: string,
    ownerName: string,
    appName: string,
    messagePrefix: string,
    message: string
) {
    if (useAppcenter) {
        await exec(`appcenter codepush release-react -a ${ownerName}/${appName} -d ${deploymentKey} --description "${messagePrefix} ${message}"`)
    }
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
    await execa('git checkout .')
}

export async function copyApp(isTest: boolean) {
    const apkPath = join(process.cwd(), 'android/app/build/outputs/apk/release')
    const file = isTest
        ? 'app-release.test.apk'
        : 'app-release.prod.apk'

    await execa(`cp ${join(apkPath, 'app-release.apk')} ${join(apkPath, file)}`)
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
