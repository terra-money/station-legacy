import { FC, ReactNode } from 'react'
import styles from './More.module.scss'

type Props = {
  title?: string
  isEmpty?: boolean
  empty?: ReactNode
  more?: () => void
}

const Pagination: FC<Props> = ({ title, empty, isEmpty, more, children }) => {
  const renderEmpty = () =>
    empty ? <>{empty}</> : <p>{title ? `No ${title}s` : 'No Data'}</p>

  return !isEmpty ? (
    <>
      {children}
      {more && (
        <button className={styles.more} onClick={more}>
          more
        </button>
      )}
    </>
  ) : (
    renderEmpty()
  )
}

export default Pagination
