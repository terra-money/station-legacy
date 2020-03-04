import React, { ReactNode, CSSProperties } from 'react'
import c from 'classnames'
import { percent, sum, gt } from '@terra-money/use-station'
import s from './FlexTable.module.scss'

type Props = {
  head: ReactNode[]
  body: ReactNode[][]
  borderless?: boolean
  hover?: boolean
  scrollX?: boolean
  height?: number
  attrs?: { align?: 'center' | 'right'; style?: CSSProperties }[]
}

const FlexTable = (props: Props) => {
  const { head, body, borderless, hover, scrollX, height, attrs = [] } = props

  const renderCell = (item: ReactNode, index: number) => {
    const { align = '', style = {} } = attrs[index] || {}
    const { width = percent(1 / head.length, 0) } = style
    return (
      <div
        className={c(s.cell, s[align])}
        style={{ width, ...style }}
        key={index}
      >
        {item}
      </div>
    )
  }

  const getMinimumWidth = () => {
    const width = sum(attrs.map(({ style }) => (style && style.width) || 0))
    return gt(width, 0) ? `${width}px` : undefined
  }

  return (
    <div className={c(scrollX && s.container)}>
      <article
        className={c(
          s.table,
          !borderless && s.bordered,
          hover && s.hover,
          height && s.column
        )}
        style={{ minWidth: getMinimumWidth(), height }}
      >
        <header className={s.head}>
          <div className={s.row}>{head.map(renderCell)}</div>
        </header>

        <section className={s.body}>
          {body.map((row, index) => (
            <div className={s.row} key={index}>
              {row.map(renderCell)}
            </div>
          ))}
        </section>
      </article>
    </div>
  )
}

export default FlexTable
