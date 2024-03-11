export interface PostSaveConfig {
    message: string,
    success: boolean
}

export enum SaveOption {
    SaveOnly = 'saveonly',
    SaveRestart = 'restart',
}