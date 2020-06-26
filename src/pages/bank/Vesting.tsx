import React, { useState } from 'react'
import { VestingItemUI } from '@terra-money/use-station'
import Icon from '../../components/Icon'
import AmountCard from './AmountCard'
import Schedule from './Schedule'
import s from './Vesting.module.scss'

const Vesting = ({ display, schedule }: VestingItemUI) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((isOpen) => !isOpen)

  return (
    <AmountCard
      {...display}
      button={
        <button onClick={toggle} className={s.button}>
          <Icon name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} />
        </button>
      }
    >
      {isOpen && (
        <section className={s.schedules}>
          {schedule.map((s, i) => (
            <Schedule {...s} key={i} />
          ))}
        </section>
      )}
    </AmountCard>
  )
}

export default Vesting
