import { LCDClient } from '@terra-money/terra.js'
import { useConfig } from '../contexts/ConfigContext'

const useLCD = () => {
  const { chain } = useConfig()
  return new LCDClient({ ...chain.current, URL: chain.current.lcd })
}

export default useLCD
