export const isLocal = process.env.NODE_ENV === 'development'
export const isProduction = process.env.REACT_APP_ENV === 'production'
export const isElectron = navigator.userAgent.includes('Electron')
export const isExtension = process.env.REACT_APP_ENV === 'extension'
