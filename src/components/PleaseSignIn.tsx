import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useInfo, Trans } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import { useApp } from '../hooks'
import Info from './Info'

type Props = { card?: boolean }

const PleaseSignIn: FC<Props> = ({ card }) => {
  const { SIGN_IN_REQUIRED } = useInfo()
  const { title, i18nKey } = SIGN_IN_REQUIRED
  const { authModal } = useApp()

  return (
    <Info icon="account_circle" title={title} card={card}>
      <Trans i18nKey={i18nKey}>
        {isExtension ? (
          <Link to="/auth" className="text-secondary clickable" />
        ) : (
          <span onClick={authModal.open} className="text-secondary clickable" />
        )}
      </Trans>
    </Info>
  )
}

export default PleaseSignIn
