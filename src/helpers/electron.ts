import { isElectron } from './env'

declare global {
  interface Window {
    require: NodeRequire
  }
}

const getElectron = (): Electron => {
  const { ipcRenderer } = window.require('electron')
  return ipcRenderer.sendSync
}

const mock = (): Electron => {
  return (channel, arg) => arg
}

const electron: Electron = isElectron ? getElectron() : mock()

export default electron
