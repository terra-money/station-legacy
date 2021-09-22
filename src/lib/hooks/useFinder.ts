import { FinderParams, FinderFunction } from '../types'
import { useCurrentChain } from '../../data/chain'

const FINDER = 'https://finder.terra.money'

export default (): FinderFunction | undefined => {
  const { chainID } = useCurrentChain()
  return ({ network, q, v }: FinderParams) =>
    `${FINDER}/${network ?? chainID}/${q}/${v}`
}
