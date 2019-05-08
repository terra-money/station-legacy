import React, { useState } from 'react'
import { format } from '../../utils'
import Icon from '../../components/Icon'
import AmountCard from './AmountCard'
import Schedule from './Schedule'
import s from './Vesting.module.scss'

const Vesting = ({ denom, total, schedules }: Vesting) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(isOpen => !isOpen)

  return (
    <AmountCard
      denom={format.denom(denom)}
      amount={total}
      button={
        <button onClick={toggle} className={s.button}>
          <Icon name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} />
        </button>
      }
    >
      {isOpen && (
        <section className={s.schedules}>
          {schedules.map((s, i) => (
            <Schedule {...s} denom={denom} key={i} />
          ))}
        </section>
      )}
    </AmountCard>
  )
}

export default Vesting
