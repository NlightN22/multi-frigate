export const appMode = process.env.NODE_ENV
export const isProduction = appMode === "production"
export const host = isProduction ? window.env?.REACT_APP_HOST : process.env.HOST

export const port = isProduction ?  window.env?.REACT_APP_PORT : process.env.PORT

const proxy = isProduction ?  window.env?.REACT_APP_FRIGATE_PROXY : process.env.REACT_APP_FRIGATE_PROXY
export const proxyURL = new URL(proxy || '')

const oidpServer = isProduction ? window.env?.REACT_APP_OPENID_SERVER : process.env.REACT_APP_OPENID_SERVER
const oidpClientId = isProduction ? window.env?.REACT_APP_CLIENT_ID : process.env.REACT_APP_CLIENT_ID
export const oidpSettings = {
    server: oidpServer || '',
    clientId: oidpClientId || '',
}