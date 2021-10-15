import { useQuery } from 'react-query'
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
    const value = format.amount(amount)
    const unit = format.denom(token, whitelist) || truncate(token)
    return [value, unit].join(' ')
  }

  const parseWord = (word: string): string => {
    if (word.endsWith(',')) {
      return parseWord(word.slice(0, -1)) + ','
    }

    return word.split(',').length > 1
      ? 'multiple coins'
      : is.nativeDenom(word)
      ? format.denom(word)
      : word
          .replaceAll(REGEXP.COIN, replaceCoin)
          .replaceAll(REGEXP.ADDRESS, replaceAddress)
  }

  return (setence: string = '') => setence.split(' ').map(parseWord).join(' ')
}

export default useParseTxText

/* utils */
export const splitTokenText = (string = '') => {
  const [, amount, token] = string.split(/(\d+)(\w+)/)
  return { amount, token }
}
