import { hostURL } from ".."

export const cameraLiveViewURL = (host: string, cameraName: string) => {
    return `ws://${hostURL.host}/proxy-ws/live/jsmpeg/${cameraName}?hostName=${host}`
}