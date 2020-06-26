import React, { FC } from 'react'
import c from 'classnames'
import Icon from './Icon'
import s from './ModalContent.module.scss'

type Props = {
  close: () => void
  goBack?: () => void
  disabled?: boolean
  actions?: { icon: string; onClick: () => void }[]
}

const ModalContent: FC<Props> = (props) => {
  const { close, goBack, disabled, actions = [], children } = props
  return (
    <article className={s.container}>
      <header className={c(s.actions, disabled && s.disabled)}>
        <section className={s.right}>
          {!!actions.length &&
            actions.map(({ icon, onClick }) => (
              <button onClick={onClick} disabled={disabled} key={icon}>
                <Icon name={icon} size={20} />
              </button>
            ))}

          <button onClick={close} disabled={disabled}>
            <Icon name="close" size={20} />
          </button>
        </section>

        {goBack && (
          <button onClick={goBack} disabled={disabled}>
            <Icon name="arrow_back" size={20} />
          </button>
        )}
      </header>

      <section className={s.main}>
        <div className={s.inner}>{children}</div>
      </section>
    </article>
  )
}

export default ModalContent
