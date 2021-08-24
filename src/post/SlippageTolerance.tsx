import { useState } from 'react'
import classNames from 'classnames/bind'
import { gt, gte, isFinite, lt, lte } from '../lib'
import styles from './SlippageTolerance.module.scss'

const cx = classNames.bind(styles)

interface Props {
  value: string
  setValue: (value: string) => void
  error?: string
}

const SlippageTolerance = ({ value, setValue, error }: Props) => {
  const [focused, setFocused] = useState(false)
  const list = ['0.1', '0.5', '1']

  const feedback = error
    ? { status: 'error', message: error }
    : gte(value, 50) || lte(value, 0) || !isFinite(value)
    ? { status: 'error', message: 'Enter a valid slippage percentage' }
    : gt(value, 5)
    ? { status: 'warning', message: 'Your transaction may be frontrun' }
    : lt(value, 0.5)
    ? { status: 'warning', message: 'Your transaction may fail' }
    : !list.includes(value)
    ? { status: 'success' }
    : undefined

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <h1 className={styles.title}>Slippage tolerance</h1>
      </header>

      <section className={styles.list}>
        {list.map((item) => (
          <button
            className={cx(styles.item, { active: value === item })}
            onClick={() => setValue(item)}
            key={item}
          >
            {item}%
          </button>
        ))}

        <section
          className={cx(styles.item, styles.group, focused && feedback?.status)}
        >
          <input
            className={cx(styles.input, {
              focused: focused || feedback?.status === 'success',
            })}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <span>%</span>
        </section>
      </section>

      {feedback && (
        <p className={cx(styles.feedback, feedback.status)}>
          {feedback.message}
        </p>
      )}
    </div>
  )
}

export default SlippageTolerance
