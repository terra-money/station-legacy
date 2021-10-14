import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { format, is } from '../../../utils'
import { truncate } from '../../../utils/format'
import useLCD from '../../../api/useLCD'
import { useCurrentChainName } from '../../../data/chain'
import { useAddress } from '../../../data/auth'
import useWhitelist from '../../../cw20/useWhitelist'
import useContracts from '../../../hooks/useContracts'

const REGEXP = {
  ADDRESS: /(terra1[a-z0-9]{38})|(terravaloper[a-z0-9]{39})/g,
  COIN: /^\d+((terra1[a-z0-9]{38})|(u[a-z]{1,4}))/g,
}

const useParseTxText = () => {
  const chainName = useCurrentChainName()
  const userAddress = useAddress()
  const { whitelist } = useWhitelist()
  const { contracts } = useContracts(chainName)
  const lcd = useLCD()
  const { data: validators } = useQuery('validators', () =>
    lcd.staking.validators()
  )

  /*
  # Terra address
  - My wallet
  - Validator address => monikier
  - Token => Symbol
  - Contract => Protocol + contract name

  # Amount and denom list
  - List of coins => Human readable
  */

  const replaceAddress = (address: string) => {
    const token = whitelist?.[address]
    const contract = contracts?.[address]
    const validator = validators?.find(
      ({ operator_address }) => operator_address === address
    )

    return address === userAddress
      ? 'My wallet'
      : validator
      ? validator.description.moniker
      : contract
      ? [contract.protocol, contract.name].join(' ')
      : token
      ? token.symbol
      : truncate(address)
  }

  const replaceCoin = (coin: string) => {
    const { amount, token } = splitTokenText(coin)
    const coinStr = format.coin(
      { amount, denom: token },
      undefined,
      undefined,
      whitelist
    )
    const isOnlyAmount = new BigNumber(coinStr).isFinite()
    return isOnlyAmount ? `${coinStr} ${truncate(token)}` : coinStr
  }

  const parseWord = (word: string): string =>
    word.split(',').filter((str) => str !== '').length > 1
      ? 'multiple coins'
      : is.nativeDenom(word)
      ? format.denom(word)
      : word
          .replaceAll(REGEXP.COIN, replaceCoin)
          .replaceAll(REGEXP.ADDRESS, replaceAddress)

  return (text: string = '') => text.split(' ').map(parseWord).join(' ')
}

export default useParseTxText

/* utils */
export const splitTokenText = (string = '') => {
  const [, amount, token] = string.split(/(\d+)(\w+)/)
  return { amount, token }
}
