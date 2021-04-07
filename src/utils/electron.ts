import { isElectron } from './env'

declare global {
  interface Window {
    require: NodeRequire
    electron: any
  }
}

const getElectron = () => {
  if (window.electron?.sendSync) {
    return window.electron.sendSync
  }

  const { ipcRenderer } = window.require('electron')
  return ipcRenderer.sendSync
}

const mock = (): Electron => {
  return (channel, arg) => arg
}

const electron: Electron = isElectron ? getElectron() : mock()

export default electron
