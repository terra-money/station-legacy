import { format } from '../../utils'
import { truncate } from '../../utils/format'
import { useDenomTrace } from '../../data/lcd/ibc'

const IBCUnit = ({ children: unit }: { children: string }) => {
  const hash = unit.replace('ibc/', '')
  const { data } = useDenomTrace(unit)

  if (!data) return <>{truncate(hash)}</>

  const { base_denom } = data

  return <>{format.denom(base_denom) || base_denom}</>
}

export default IBCUnit
