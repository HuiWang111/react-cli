import { mergeConfig, publishReactNative } from './types/react-native'
import { getConfigFile } from './utils'
import { PublishConfig } from './interface'
import chalk from 'chalk'

export async function publish(commands: string[], options: Record<string, string>) {
    const [type] = commands;

    switch(type) {
        case 'react-native': {
            const configFile = getConfigFile(options)
            const publishConfig: PublishConfig = await import(configFile)
            const config = mergeConfig(publishConfig, options)
            publishReactNative(config)
                .catch(e => {
                    console.info('')
                    console.info(
                        chalk.red(`Error: ${e.message ?? e}`)
                    )
                })
            break;
        }
        default: {
            console.info(`publish type '${type}' not found`)
        }
    }
}
