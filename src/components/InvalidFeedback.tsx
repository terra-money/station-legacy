import c from 'classnames'
import Icon from './Icon'
import styles from './InvalidFeedback.module.scss'

interface Props {
  tooltip?: boolean
  className?: string
  children: string
  warn?: boolean
}

const InvalidFeedback = ({ tooltip, className, children, warn }: Props) =>
  children ? (
    <p
      className={c(
        'invalid-feedback',
        warn && styles.warn,
        tooltip && 'tooltip',
        className
      )}
    >
      <Icon name={warn ? 'info' : 'error'} />
      <span>{children}</span>
    </p>
  ) : null

export default InvalidFeedback
