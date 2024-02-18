export const appMode = process.env.NODE_ENV
const isProduction = appMode === "production"
if (isProduction && typeof process.env.REACT_APP_HOST === 'undefined') {
    throw new Error('REACT_APP_HOST environment variable is undefined');
}
export const host = process.env.REACT_APP_HOST

if (isProduction && typeof process.env.REACT_APP_PORT === 'undefined') {
    throw new Error('REACT_APP_PORT environment variable is undefined');
}
export const port = process.env.REACT_APP_PORT

if (typeof process.env.REACT_APP_FRIGATE_PROXY === 'undefined') {
    throw new Error('REACT_APP_FRIGATE_PROXY environment variable is undefined');
}
export const proxyURL = new URL(process.env.REACT_APP_FRIGATE_PROXY)

if (typeof process.env.REACT_APP_OPENID_SERVER === 'undefined') {
    throw new Error('REACT_APP_OPENID_SERVER environment variable is undefined');
}
if (typeof process.env.REACT_APP_CLIENT_ID === 'undefined') {
    throw new Error('REACT_APP_CLIENT_ID environment variable is undefined');
}

export const oidpSettings = {
    server: process.env.REACT_APP_OPENID_SERVER,
    clientId: process.env.REACT_APP_CLIENT_ID,
}