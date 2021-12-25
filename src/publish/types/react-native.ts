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

export function mergeConfig({
    shouldCleanCodeChange = true,
    mode = 'test',
    shouldRewriteApplicationId = false,
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
    shouldRewriteApplicationId: false,
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
}, options: Record<string, any>): InternalPublishConfig {
    return {
        /**
         * 打包完成后是否执行 git checkout . 清空代码的改动
         * 由于打包过程中可能会有写入文件的操作造成代码的改动，而这些打包完成之后无需保留，此时可以设置该项为true
         */
        shouldCleanCodeChange: options.shouldCleanCodeChange ?? shouldCleanCodeChange,
        /**
         * 'test' | 'production'
         * 打正式包还是打测试包
         */
        mode: options.mode ?? mode,
        /**
         * 是否重写applicationId
         * 区分测试和生产环境的applicationId可以实现在同一台机器上同时安装测试版和正式版
         */
        shouldRewriteApplicationId,
        /**
         * 当开启重写applicationId时，需要将目前applicationId传递进来
         * applicationId在 android/app/build.gradle 文件中
         */
        applicationId,
        /**
         * 是否生成版本
         */
        generateVersion: options.generateVersion === false ? options.generateVersion : generateVersion,
        /**
         * 版本号写入文件的路径
         */
        versionFilePath: options.versionFilePath ?? versionFilePath,
        /**
         * 'ts' | 'js'
         * 写入文件的拓展名
         */
        extname: options.extname ?? extname,
        /**
         * 是否生成环境变量
         */
        generateEnv: options.generateEnv === false ? options.generateEnv : generateEnv,
        /**
         * 环境变量写入文件的路径
         */
        envFilePath: options.envFilePath ?? envFilePath,
        /**
         * 是否重写app安装后的显示名称
         * 常用于区分测试版还是正式版
         */
        generateAppName: options.generateAppName === false ? options.generateAppName : generateAppName,
        /**
         * 打包完成后是否自动 codepush
         */
        codePush: options.codePush === false ? options.codePush : codePush,
        /**
         * 打包完成之后是否自动打开apk所在文件夹
         */
        open: options.open ?? open,
        /**
         * 打包完成后是否自动复制一个apk文件
         * test模式会复制一个名为 app-release.test.apk
         * production 模式会复制一个名为 app-release.prod.apk
         */
        shouldCopyApp: options.shouldCopyApp ?? shouldCopyApp,
        /**
         * 热更时显示的更新信息
         */
        message: options.m ?? '',
        /**
         * 打包完成之后的回调
         */
        onComplete
    }
}

export async function publishReactNative({
    shouldCleanCodeChange,
    mode,
    shouldRewriteApplicationId,
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
    try {
        if (shouldCleanCodeChange) {
            let isContinue = true
            try {
                if (!await isCodeUpToDate()) {
                    const answers = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'isContinue',
                            message: '检测到当前代码有未提交的，发布完成之后会执行 `git checkout .` 清除所有改动，请确认是否继续？',
                            choices: ['是', '否']
                        }
                    ])
                    isContinue = answers.isContinue === '是'
                }
            } catch(e) {
                // not a git repository
                // do nothing
            }
    
            if (!isContinue) {
                return
            }
        }

        if (!['ts', 'js'].includes(extname)) {
            return Promise.reject(`extname expected 'ts' or 'js', but received '${extname}'`)
        }
    
        let currentBranch: string
        try {
            currentBranch = await getCurrentBranch()
        } catch(e) {
            // not a git repository
            currentBranch = ''
        }
    
        const modeRes: PublishMode = typeof mode === 'function'
            ? mode(currentBranch)
            : mode
        
        if (!['test', 'production'].includes(modeRes)) {
            return Promise.reject(`mode expected 'test' or 'production', but received '${modeRes}'`)
        }
    
        const { year, month, day } = getYMD()
        const isTest: boolean = modeRes === 'test'
    
        if (shouldRewriteApplicationId) {
            if (!applicationId) {
                return Promise.reject('when shouldRewriteApplicationId is true, applicationId is required')
            }
    
            await writeBuildGradleFileByEnv(isTest, applicationId)
        }
    
        if (generateVersion) {
            const version = generateVersion({ year, month, day, mode: modeRes })
            await writeVersion(version, `${versionFilePath}/version.${extname}`)
        }
    
        if (generateEnv) {
            const env = generateEnv(modeRes)
            await writeEnv(env, `${envFilePath}/env.${extname}`)
        }
    
        if (generateAppName) {
            const { appName, toReplaceAppName } = generateAppName(modeRes)
            if (appName !== toReplaceAppName) {
                await writeAppName(appName, toReplaceAppName)
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
                getCustomizedCommand,
                getDeploymentName,
                getMessagePrefix,
                ownerName,
                appName
            } = codePush
    
            const deploymentName = getDeploymentName?.(modeRes)
            if (!deploymentName) {
                return Promise.reject('when enable codePush, deploymentName is required')
            }
    
            const messagePrefix = getMessagePrefix?.({ year, month, day, mode: modeRes }) || ''
    
            await runCodePush(
                deploymentName,
                ownerName,
                appName,
                messagePrefix,
                message,
                getCustomizedCommand
            )
        }
        
        if (shouldCleanCodeChange) {
            await cleanCodeChange()
        }
    
        onComplete?.(modeRes)
    } catch (e) {
        return Promise.reject(e)
    }
}
