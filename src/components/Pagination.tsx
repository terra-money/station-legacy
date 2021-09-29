import { FC, ReactNode } from 'react'
import PaginationButtons from './PaginationButtons'
import { Pagination as PaginationParams } from '../lib'
import { toNumber, plus } from '../lib'

type Props = {
  count: number
  title?: string
  empty?: ReactNode
  link?: (page: number) => { pathname: string; search: string }
  action?: (page: number) => void
}

const Pagination: FC<PaginationParams & Props> = (props) => {
  const { count, title, empty, link, action, children, ...pagination } = props
  const { page, limit } = pagination

  const getLinks = () =>
    link && {
      next: link(toNumber(plus(page, 1))),
    }

  const getActions = () =>
    action && {
      next: () => action(toNumber(plus(page, 1))),
    }

  const renderEmpty = () =>
    empty ? <>{empty}</> : <p>{title ? `No ${title}s` : 'No Data'}</p>

  const hideButtons = count < limit

  return count > 0 ? (
    <>
      {children}
      {!hideButtons && (
        <PaginationButtons links={getLinks()} actions={getActions()} />
      )}
    </>
  ) : (
    renderEmpty()
  )
}

export default Pagination
