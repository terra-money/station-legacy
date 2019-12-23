import React, { FC } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useApp, useAuth } from '../hooks'
import Card from './Card'
import Info from './Info'

type Props = { card?: boolean }

const WithAuth: FC<Props> = ({ card, children }) => {
  const { t } = useTranslation()
  const { authModal } = useApp()
  const { address } = useAuth()

  const info = (
    <Info icon="account_circle" title={t('Sign In Required')}>
      <Trans i18nKey="please sign in">
        This page shows data for a specific address. To access the page, please{' '}
        <span onClick={authModal.open} className="text-secondary clickable">
          sign in
        </span>
        .
      </Trans>
    </Info>
  )

  return address ? <>{children}</> : card ? <Card>{info}</Card> : info
}

export default WithAuth
