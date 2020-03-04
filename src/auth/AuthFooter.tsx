import React from 'react'
import { AuthMenuUI, Trans } from '@terra-money/use-station'
import Icon from '../components/Icon'
import Pop from '../components/Pop'
import ExtLink from '../components/ExtLink'
import s from './AuthFooter.module.scss'

type Props = AuthMenuUI & { onClick: () => void }
const AuthFooter = ({ signInWithLedger, tooltip, onClick }: Props) => {
  const [p, button] = signInWithLedger
  const { label, link, i18nKey } = tooltip

  const content = (
    <Trans i18nKey={i18nKey}>
      <ExtLink href={link} className={s.link} />
    </Trans>
  )

  return (
    <footer className={s.footer}>
      <p className={s.address}>
        {p} <button onClick={onClick}>{button}</button>
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
