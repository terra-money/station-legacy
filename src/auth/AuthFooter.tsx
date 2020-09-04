import React from 'react'
import { AuthMenuUI, Trans } from '@terra-money/use-station'
import { useAuthModal } from './useAuthModal'
import Icon from '../components/Icon'
import Pop from '../components/Pop'
import s from './AuthFooter.module.scss'

const AuthFooter = ({ signInWithLedger, tooltip }: AuthMenuUI) => {
  const { actions } = useAuthModal()
  const [p, button] = signInWithLedger
  const { label, i18nKey } = tooltip

  const content = (
    <Trans i18nKey={i18nKey}>
      <button className={s.link} onClick={actions.download} />
    </Trans>
  )

  return (
    <footer className={s.footer}>
      <p className={s.address}>
        {p} <button onClick={actions.glance}>{button}</button>
      </p>

      <Pop type="pop" placement="top" width={380} content={content}>
        {({ ref, iconRef, getAttrs }) => (
          <span {...getAttrs({})} ref={ref}>
            <Icon name="info" forwardRef={iconRef} />
            {label}
          </span>
        )}
      </Pop>
    </footer>
  )
}

export default AuthFooter
