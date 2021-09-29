import { LCDClient } from '@terra-money/terra.js'
import { useMemo } from 'react'
import { useCurrentChain } from '../data/chain'

const useLCD = () => {
  const { chainID, lcd: URL } = useCurrentChain()
  const lcd = useMemo(() => new LCDClient({ chainID, URL }), [chainID, URL])
  return lcd
}

export default useLCD
