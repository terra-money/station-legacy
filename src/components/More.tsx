import { FC, ReactNode } from 'react'

type Props = {
  title?: string
  isEmpty?: boolean
  empty?: ReactNode
  more?: () => void
}

const More: FC<Props> = ({ title, empty, isEmpty, more, children }) => {
  const renderEmpty = () =>
    empty ? <>{empty}</> : <p>{title ? `No ${title}s` : 'No Data'}</p>

  return !isEmpty ? (
    <>
      {children}
      {more && (
        <button className="btn-more" onClick={more}>
          more
        </button>
      )}
    </>
  ) : (
    renderEmpty()
  )
}

export default More
