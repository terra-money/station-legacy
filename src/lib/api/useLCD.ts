import { LCDClient } from '@terra-money/terra.js'
import { useMemo } from 'react'
import { useConfig } from '../contexts/ConfigContext'

const useLCD = () => {
  const { chain } = useConfig()
  const { chainID, lcd: URL } = chain.current
  const lcd = useMemo(() => new LCDClient({ chainID, URL }), [chainID, URL])
  return lcd
}

export default useLCD
