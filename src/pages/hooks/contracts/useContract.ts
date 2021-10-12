import { useQuery } from 'react-query'
import useLCD from '../../../api/useLCD'

export default (search: string) => {
  const lcd = useLCD()

  return useQuery(['contract'], () => lcd.wasm.contractInfo(search), {
    enabled: !!search,
  })
}
