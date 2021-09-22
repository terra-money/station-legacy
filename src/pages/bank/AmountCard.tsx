import { FC, ReactNode, useState } from 'react'
import { AvailableItem } from '../../lib'
import { TERRA_ASSETS } from '../../lib/pages/constants'
import { isExtension } from '../../utils/env'
import { ReactComponent as Terra } from '../../images/Terra.svg'
import Card from '../../components/Card'
import Number from '../../components/Number'
import s from './AmountCard.module.scss'

interface Props extends AvailableItem {
  button: ReactNode
  icon?: string
}

const AmountCard: FC<Props> = ({ display, button, children, ...props }) => {
  const { currencyValueDisplay } = props
  const { value, unit } = display
  const [iconError, setIconError] = useState(false)
  const size = { width: 24, height: 24 }
  const src = `${TERRA_ASSETS}/icon/60/${unit}.png`
  const showEstimatedValue =
    currencyValueDisplay && unit !== currencyValueDisplay.unit

  const icon = props.icon ? (
    <img src={props.icon} className={s.icon} alt="" {...size} />
  ) : !iconError ? (
    <img src={src} onError={() => setIconError(true)} alt="" {...size} />
  ) : (
    <Terra {...size} />
  )

  const content = (
    <article className={s.article}>
      <header className={s.header}>
        <h1 className={s.denom}>
          {icon}
          {unit}
        </h1>

        <section className={s.value}>
          <Number className={s.amount}>{value}</Number>

          {showEstimatedValue && (
            <p className={s.estimated}>
              <Number {...currencyValueDisplay} estimated />
            </p>
          )}
        </section>

        <div className={s.button}>{button}</div>
      </header>

      {children}
    </article>
  )

  return isExtension ? (
    <div className={s.extension}>{content}</div>
  ) : (
    <Card bodyClassName={s.card}>{content}</Card>
  )
}

export default AmountCard
