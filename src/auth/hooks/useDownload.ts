import { useTranslation } from 'react-i18next'
import { Download } from '../../types'

export default (): Download => {
  const { t } = useTranslation()

  return {
    title: t('Auth:Menu:Download Terra Station'),
    links: [
      {
        key: 'mac',
        label: 'Mac',
        link: 'https://github.com/terra-money/station/releases/download/v3.5.0/Terra.Station-1.1.0.dmg',
        ext: 'dmg',
      },
      {
        key: 'win',
        label: 'Windows',
        link: 'https://github.com/terra-money/station/releases/download/v3.5.0/Terra.Station.Setup.1.1.0.exe',
        ext: 'exe',
      },
      {
        key: 'linux',
        label: 'Linux',
        links: [
          {
            link: 'https://github.com/terra-money/station/releases/download/v3.5.0/station-electron_1.1.1_amd64.deb',
            ext: 'deb',
          },
          {
            link: 'https://github.com/terra-money/station/releases/download/v3.5.0/station-electron-1.1.1.x86_64.rpm',
            ext: 'rpm',
          },
        ],
      },
    ],
  }
}
