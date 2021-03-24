import React, { FC, ReactNode } from 'react'
import PaginationButtons from './PaginationButtons'
import { Pagination as PaginationParams } from '../use-station/src'
import { toNumber, plus } from '../use-station/src'

type Props = {
  count: number
  title?: string
  empty?: ReactNode
  link?: (page: number) => { pathname: string; search: string }
  action?: (page: number) => void
}

const Pagination: FC<PaginationParams & Props> = (props) => {
  const { count, title, empty, link, action, children, ...pagination } = props
  const { page } = pagination

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

  return count > 0 ? (
    <>
      {children}
      <PaginationButtons links={getLinks()} actions={getActions()} />
    </>
  ) : (
    renderEmpty()
  )
}

export default Pagination
