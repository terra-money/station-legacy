import React from 'react'
import { useTranslation } from 'react-i18next'
import Info from './Info'
import ProgressCircle from './ProgressCircle'

const Loading = () => {
  const { t } = useTranslation()
  return (
    <Info icon={<ProgressCircle size={45} />} title={t('Data is loading…')}>
      {t('Please wait a moment.')}
    </Info>
  )
}

export default Loading
