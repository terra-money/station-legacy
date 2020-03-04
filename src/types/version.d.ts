interface Version {
  version: string
  macUrl: string
  windowsUrl: string
  linuxUrl: string
  title: string
  message: string
  forceUpdate: boolean
}

interface VersionWeb {
  version: string
  title: string
  content: string
  forceUpdate: boolean
}
