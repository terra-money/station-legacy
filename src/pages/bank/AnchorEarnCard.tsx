import { ReactNode } from 'react'
import { format } from '../../utils'
import useAnchorEarn from './useAnchorEarn'
import styles from './AnchorEarnCard.module.scss'

const AnchorEarnCard = ({ button }: { button: ReactNode }) => {
  const earn = useAnchorEarn()

  if (!earn) return null

  const { aust, total } = earn

  return (
    <div className={styles.component}>
      <div className={styles.row}>
        <div className={styles.content}>
          <div className={styles.label}>
            Deposit <span className={styles.badge}>20% APY</span>
          </div>
          <div>{format.amount(aust)}</div>
        </div>

        <div className={styles.action}>{button}</div>
      </div>

      <div className={styles.row}>
        <div className={styles.content}>
          <div className={styles.label}>Total UST</div>
          <div>{format.amount(total)}</div>
        </div>

        <div className={styles.action} />
      </div>
    </div>
  )
}

export default AnchorEarnCard
