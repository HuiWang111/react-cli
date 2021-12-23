import { PublishConfig, PublishMode, InternalPublishConfig } from '../interface'
import {
    isCodeUpToDate,
    getCurrentBranch,
    writeBuildGradleFileByEnv,
    getYMD,
    writeVersion,
    writeEnv,
    writeAppName,
    buildApk,
    copyApp,
    openApkDir,
    cleanCodeChange,
    codePush as runCodePush
} from '../utils'
import inquirer from 'inquirer'

export function getDefaultConfig({
    shouldCleanCodeChange = true,
    mode = 'test',
    shouldRewriteBuildGradleFile = false,
    applicationId = '',
    generateVersion = false,
    versionFilePath = 'src/config',
    extname = 'ts',
    generateEnv = false,
    envFilePath = 'src/config',
    generateAppName = false,
    codePush = false,
    open = false,
    shouldCopyApp = false,
    onComplete
}: PublishConfig = {
    shouldCleanCodeChange: true,
    mode: 'test',
    shouldRewriteBuildGradleFile: false,
    applicationId: '',
    generateVersion: false,
    versionFilePath: 'src/config',
    extname: 'ts',
    generateEnv: false,
    envFilePath: 'src/config',
    generateAppName: false,
    codePush: false,
    open: false,
    shouldCopyApp: false
}, message = ''): InternalPublishConfig {
    return {
        shouldCleanCodeChange,
        mode,
        shouldRewriteBuildGradleFile,
        applicationId,
        generateVersion,
        versionFilePath,
        extname,
        generateEnv,
        envFilePath,
        generateAppName,
        codePush,
        open,
        shouldCopyApp,
        message,
        onComplete
    }
}

export async function publishReactNative({
    shouldCleanCodeChange,
    mode,
    shouldRewriteBuildGradleFile,
    applicationId,
    generateVersion,
    versionFilePath,
    extname,
    generateEnv,
    envFilePath,
    generateAppName,
    codePush,
    open,
    shouldCopyApp,
    message,
    onComplete
}: InternalPublishConfig) {
    if (shouldCleanCodeChange) {
        let isContinue = true
        if (!await isCodeUpToDate()) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'isContinue',
                    message: '检测到当前代码有未提交的，发布完成之后会执行 `git checkout .`重置所有改动，请确认是否继续？',
                    choices: ['是', '否']
                }
            ])
            isContinue = answers.isContinue === '是'
        }

        if (!isContinue) {
            return
        }
    }

    const currentBranch = await getCurrentBranch()
    const { year, month, day } = getYMD()
    const modeRes: PublishMode = typeof mode === 'function'
        ? mode(currentBranch)
        : mode
    const isTest: boolean = modeRes === 'test'

    if (shouldRewriteBuildGradleFile) {
        if (!applicationId) {
            Promise.reject(new Error('when shouldRewriteBuildGradleFile is true, applicationId is required'))
            return
        }

        writeBuildGradleFileByEnv(isTest, applicationId)
    }

    if (generateVersion) {
        const version = generateVersion({ year, month, day, mode: modeRes })
        await writeVersion(version, `${versionFilePath}/version.${extname}`)
    }

    if (generateEnv) {
        const env = generateEnv(modeRes)
        writeEnv(env, `${envFilePath}/env.${extname}`)
    }

    if (generateAppName) {
        const { appName, toReplaceAppName } = generateAppName(modeRes)
        if (appName !== toReplaceAppName) {
            writeAppName(appName, toReplaceAppName)
        }
    }

    await buildApk()

    if (shouldCopyApp) {
        await copyApp(isTest)
    }

    if (open) {
        await openApkDir()
    }

    if (codePush) {
        const {
            useAppcenter = true,
            getDeploymentKey,
            getMessagePrefix,
            ownerName,
            appName
        } = codePush

        const deploymentKey = getDeploymentKey?.(modeRes)
        if (!deploymentKey) {
            Promise.reject(new Error('when enable codePush, deploymentKey is required'))
            return
        }

        const messagePrefix = getMessagePrefix?.({ year, month, day, mode: modeRes }) || ''

        await runCodePush(
            useAppcenter,
            deploymentKey,
            ownerName,
            appName,
            messagePrefix,
            message
        )

        if (shouldCleanCodeChange) {
            await cleanCodeChange()
        }

        onComplete?.(modeRes)
    }
}
