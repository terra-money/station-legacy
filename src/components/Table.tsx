import React, { FC } from 'react'
import c from 'classnames'

type Props = { small?: boolean; light?: boolean }

const Table: FC<Props> = ({ small, light, children }) => (
  <div className="table-responsive">
    <table className={c('table', small && 'table-sm', light && 'table-light')}>
      {children}
    </table>
  </div>
)

export default Table
