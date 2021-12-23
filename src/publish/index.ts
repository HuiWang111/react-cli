import { getDefaultConfig, publishReactNative } from './types/react-native'
import { getConfigFile } from './utils'
import { PublishConfig } from './interface'

export async function publish(commands: string[], options: Record<string, string>) {
    const [type] = commands;

    switch(type) {
        case 'react-native': {
            const configFile = getConfigFile(options)
            const publishConfig: PublishConfig = await import(configFile)
            const config = getDefaultConfig(publishConfig, options.m)
            await publishReactNative(config)

            break;
        }
        default: {
            console.info(`publish type '${type}' not found`)
        }
    }
}
