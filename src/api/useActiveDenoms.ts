import { useQuery } from 'react-query'
import useLCD from './useLCD'

export default () => {
  const lcd = useLCD()
  return useQuery('lcd.oracle.activeDenoms', () => lcd.oracle.activeDenoms())
}
