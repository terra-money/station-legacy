import { format } from '../../utils'
import { truncate } from '../../utils/format'
import { useDenomTrace } from '../../data/lcd/ibc'
import styles from './IBCUnit.module.scss'

const IBCUnit = ({ children: unit }: { children: string }) => {
  const hash = unit.replace('ibc/', '')
  const { data } = useDenomTrace(unit)

  if (!data) return <>{truncate(hash)}</>

  const { base_denom, path } = data

  return (
    <article>
      {format.denom(base_denom) || base_denom}

      <span className={styles.meta}>
        {truncate(hash)} ({path.replace('transfer/', '')})
      </span>
    </article>
  )
}

export default IBCUnit
