export type PublishMode = 'test' | 'production';
export type PublishModeCallback = (currentBranch: string) => PublishMode;
export type GenerateVersionCallback = (params: GenerateVersionParams) => string;
export type GenerateEnvCallback = (mode: PublishMode) => string;
export type GenerateAppNameCallback = (mode: PublishMode) => GenerateAppNameCallbackReturn;
export type GetMessagePrefixCallback = (params: GenerateVersionParams) => string;
export type GetDeploymentKeyCallback = (mode: PublishMode) => string;
export type GetCustomizedCommandCallback = (params: {
    deploymentKey: string,
    ownerName: string,
    appName: string,
    messagePrefix: string,
    message: string
}) => string;

export interface GenerateVersionParams {
    year: string;
    month: string;
    day: string;
    mode: PublishMode;
}

export interface CodePushOptions {
    getCustomizedCommand?: GetCustomizedCommandCallback;
    getMessagePrefix?: GetMessagePrefixCallback;
    getDeploymentKey: GetDeploymentKeyCallback;
    ownerName: string;
    appName: string;
}

export interface GenerateAppNameCallbackReturn {
    appName: string;
    toReplaceAppName: string;
}

export interface PublishConfig {
    shouldCleanCodeChange?: boolean;
    mode?: PublishMode | PublishModeCallback;
    shouldRewriteApplicationId?: boolean;
    applicationId?: string;
    generateVersion?: false | GenerateVersionCallback;
    versionFilePath?: string;
    extname?: 'ts' | 'js';
    generateEnv?: false | GenerateEnvCallback;
    envFilePath?: string;
    generateAppName?: false | GenerateAppNameCallback;
    codePush: false | CodePushOptions;
    open?: boolean;
    shouldCopyApp?: boolean;
    onComplete?: (mode: PublishMode) => void;
}

export interface InternalPublishConfig extends Omit<Required<PublishConfig>, 'onComplete'> {
    message: string;
    onComplete?: (mode: PublishMode) => void;
}