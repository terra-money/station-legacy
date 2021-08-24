import { FinderParams, FinderFunction } from '../types'
import { useConfig } from '../contexts/ConfigContext'

const FINDER = 'https://finder.terra.money'

export default (): FinderFunction | undefined => {
  const { chain } = useConfig()
  const { chainID } = chain.current
  return ({ network, q, v }: FinderParams) =>
    `${FINDER}/${network ?? chainID}/${q}/${v}`
}
