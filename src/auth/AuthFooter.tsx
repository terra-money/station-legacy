import React from 'react'
import { AuthMenuUI, Trans } from '@terra-money/use-station'
import Icon from '../components/Icon'
import Pop from '../components/Pop'
import s from './AuthFooter.module.scss'

interface Props extends AuthMenuUI {
  onClickGlance: () => void
  onClickDownload: () => void
}

const AuthFooter = ({ signInWithLedger, tooltip, ...props }: Props) => {
  const { onClickGlance, onClickDownload } = props
  const [p, button] = signInWithLedger
  const { label, i18nKey } = tooltip

  const content = (
    <Trans i18nKey={i18nKey}>
      <button className={s.link} onClick={onClickDownload} />
    </Trans>
  )

  return (
    <footer className={s.footer}>
      <p className={s.address}>
        {p} <button onClick={onClickGlance}>{button}</button>
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
