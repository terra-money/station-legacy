import React from 'react'
import Icon from '../components/Icon'
import s from './Pagination.module.scss'

interface Props {
  current: number
  length: number
  actions: (() => void)[]
}

const Pagination = ({ current, length, actions }: Props) => {
  const [prev, next] = actions

  return (
    <div className={s.component}>
      <button onClick={prev}>
        <Icon name="navigate_before" size={24} />
      </button>

      <span className={s.text}>
        {current} of {length}
      </span>

      <button onClick={next}>
        <Icon name="navigate_next" size={24} />
      </button>
    </div>
  )
}

export default Pagination
