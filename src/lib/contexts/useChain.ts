import { useState, useEffect } from 'react'
import { ChainOptions, ChainConfig } from '../types'
import fcd from '../api/fcd'

export default (initial: ChainOptions): ChainConfig => {
  const [current, setCurrent] = useState<ChainOptions>(initial)

  const set = (options: ChainOptions) => {
    fcd.defaults.baseURL = options.fcd
    setCurrent(options)
  }

  useEffect(() => {
    set(initial)
    // eslint-disable-next-line
  }, [initial.name])

  return { current, set }
}
