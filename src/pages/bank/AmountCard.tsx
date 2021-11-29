import { FC, ReactNode, useState } from 'react'
import classNames from 'classnames/bind'
import { Buy } from '@terra-money/react-widget'
import { AvailableItem } from '../../lib'
import { TERRA_ASSETS, TRANSAK_API_KEY } from '../../constants'
import { is } from '../../utils'
import { isExtension } from '../../utils/env'
import { ReactComponent as Terra } from '../../images/Terra.svg'
import { ReactComponent as IBC } from '../../images/IBC.svg'
import Card from '../../components/Card'
import Number from '../../components/Number'
import Icon from '../../components/Icon'
import IBCUnit from './IBCUnit'
import s from './AmountCard.module.scss'

const cx = classNames.bind(s)

interface Props extends AvailableItem {
  button: ReactNode
  buttonAttrs?: { onClick: () => void; children: string }
  icon?: string
  extended?: boolean
}

const AmountCard: FC<Props> = ({ display, button, children, ...props }) => {
  const { currencyValueDisplay, buttonAttrs, extended } = props
  const { value, unit } = display
  const isIBC = is.ibcDenom(unit)

  const [iconError, setIconError] = useState(false)
  const size = { width: 24, height: 24 }
  const src = `${TERRA_ASSETS}/icon/60/${unit}.png`
  const showEstimatedValue =
    currencyValueDisplay && unit !== currencyValueDisplay.unit

  const icon = props.icon ? (
    <img src={props.icon} className={s.icon} alt="" {...size} />
  ) : !iconError ? (
    <img src={src} onError={() => setIconError(true)} alt="" {...size} />
  ) : isIBC ? (
    <IBC {...size} />
  ) : (
    <Terra {...size} />
  )

  const content = (
    <article className={s.article}>
      <header className={cx(s.header, { extended })}>
        <h1 className={s.denom}>
          {icon}
          {isIBC ? <IBCUnit>{unit}</IBCUnit> : unit}

          {!isExtension && (unit === 'Luna' || unit === 'UST') && (
            <div className={s.buy}>
              <Buy transakApiKey={TRANSAK_API_KEY} currency={unit} />
            </div>
          )}
        </h1>

        <section className={s.value}>
          <Number className={s.amount}>{value}</Number>

          {showEstimatedValue && (
            <p className={s.estimated}>
              <Number {...currencyValueDisplay} estimated integer />
            </p>
          )}
        </section>

        {isExtension ? (
          <Icon name="chevron_right" />
        ) : (
          <div className={s.button}>{button}</div>
        )}
      </header>

      {children}
    </article>
  )

  return isExtension ? (
    <button className={s.extension} {...buttonAttrs}>
      {content}
    </button>
  ) : (
    <Card bodyClassName={s.card}>{content}</Card>
  )
}

export default AmountCard
