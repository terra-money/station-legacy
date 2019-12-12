import React from 'react'
import c from 'classnames'
import { FINDER } from '../helpers/constants'
import { useApp } from '../hooks'

interface Props {
  network?: string
  q: string
  v?: string
  children: string
  className?: string
  brand?: boolean
}

const Finder = ({ network, q, v, children, className, brand }: Props) => {
  const { chain } = useApp()
  return (
    <a
      href={`${FINDER}/${network || chain}/${q}/${v || children}`}
      target="_blank"
      rel="noopener noreferrer"
      className={c(className, brand && 'text-primary')}
    >
      {children}
    </a>
  )
}

export default Finder
