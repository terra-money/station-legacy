import { useTranslation } from 'react-i18next'
import { Dictionary } from 'ramda'
import { Card } from '../types'

export default (): Dictionary<Card> => {
  const { t } = useTranslation()

  return {
    LOADING: {
      title: t('Common:Loading:Data is loading...'),
      content: t('Common:Loading:Please wait a moment'),
    },
    ERROR: {
      title: t('Common:Error:Oops! Something went wrong'),
      content: t('Common:Error:You have encountered an error'),
    },
    DISCONNECTED: {
      title: t('Common:Error:No internet connection'),
      content: t(
        'Common:Error:Please check your internet connection and retry again'
      ),
    },
    SIGN_IN_REQUIRED: {
      title: t('Auth:Common:Connection required'),
      i18nKey:
        'Auth:Common:This page shows data for a specific address. To access the page, please <0>connect</0>.',
      button: t('Auth:Menu:Select wallet'),
    },
    LOCALTERRA_ERROR: {
      title: t("Common:Error:LocalTerra doesn't seem to be running."),
      content: t(
        'Common:Error:LocalTerra is a one-click local Terra testnet & ecosystem for easy development of smart contracts and Terra tools.'
      ),
      button: t('Common:Error:Learn more about it here'),
    },
  }
}
