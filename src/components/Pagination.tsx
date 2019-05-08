import React, { FC, ReactNode } from 'react'
import { plus, minus, div, ceil, gt } from '../api/math'
import PaginationButtons from './PaginationButtons'

type Props = {
  title?: string
  empty?: ReactNode
  link?: (page: string) => { pathname: string; search: string }
  action?: (page: string) => void
}

const Pagination: FC<Pagination & Props> = props => {
  const { title, empty, link, action, children, ...pagination } = props
  const { page, limit, totalCnt } = pagination
  const total = Number(ceil(div(totalCnt, limit)))

  const getLinks = () =>
    link && {
      start: link('1'),
      prev: link(minus(page, 1)),
      next: link(plus(page, 1)),
      end: link(String(total))
    }

  const getActions = () =>
    action && {
      start: () => action('1'),
      prev: () => action(minus(page, 1)),
      next: () => action(plus(page, 1)),
      end: () => action(String(total))
    }

  const renderEmpty = () =>
    empty ? <>{empty}</> : <p>{title ? `No ${title}s` : 'No Data'}</p>

  return gt(totalCnt, 0) ? (
    <>
      {children}
      <PaginationButtons
        links={getLinks()}
        actions={getActions()}
        current={page}
        total={total}
      />
    </>
  ) : (
    renderEmpty()
  )
}

export default Pagination
