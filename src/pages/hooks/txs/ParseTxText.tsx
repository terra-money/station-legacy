import { Fragment, ReactNode } from 'react'
import { useQuery } from 'react-query'
import { format, is } from '../../../utils'
import { truncate } from '../../../utils/format'
import useLCD from '../../../api/useLCD'
import { useCurrentChainName } from '../../../data/chain'
import { useDenomTrace } from '../../../data/lcd/ibc'
import { useAddress } from '../../../data/auth'
import useWhitelist from '../../../cw20/useWhitelist'
import useContracts from '../../../hooks/useContracts'

const REGEXP = {
  ADDRESS: /(terra1[a-z0-9]{38})|(terravaloper[a-z0-9]{39})/g,
  COIN: /^\d+((terra1[a-z0-9]{38})|(u[a-z]{1,4})|(ibc\/[A-Z0-9]{64}))/g,
}

const IBCBaseDenom = ({ children: unit }: { children: string }) => {
  const { data } = useDenomTrace(unit)
  const hash = unit.replace('ibc/', '')
  if (!data) return <>{truncate(hash)}</>
  const { base_denom } = data
  return <>{format.denom(base_denom) || base_denom}</>
}

const Coin = ({ children: coin }: { children: string }) => {
  const { whitelist } = useWhitelist()
  const { amount, token } = splitTokenText(coin)
  const value = format.amount(amount)

  const unit = is.ibcDenom(token) ? (
    <IBCBaseDenom>{token}</IBCBaseDenom>
  ) : (
    format.denom(token, whitelist) || truncate(token)
  )
  return (
    <>
      {value} {unit}
    </>
  )
}

const ParseTxText = ({ children: sentence }: { children?: string }) => {
  const chainName = useCurrentChainName()
  const userAddress = useAddress()
  const { whitelist } = useWhitelist()
  const { contracts } = useContracts(chainName)
  const lcd = useLCD()
  const { data: validators } = useQuery('validators', async () => {
    const [validators] = await lcd.staking.validators()
    return validators
  })

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

  const parseWord = (word: string): ReactNode => {
    if (word.endsWith(',')) {
      return <>{parseWord(word.slice(0, -1))},</>
    }

    return (
      <>
        {word.split(',').length > 1
          ? 'multiple coins'
          : is.nativeDenom(word)
          ? format.denom(word)
          : word.match(REGEXP.ADDRESS)
          ? replaceAddress(word)
          : word.match(REGEXP.COIN)
          ? word
              .split(',')
              .map((coin, index) => <Coin key={index}>{coin}</Coin>)
          : word}
      </>
    )
  }

  return (
    <>
      {sentence?.split(' ').map((word, index) => (
        <Fragment key={index}>
          {!!index && ' '}
          {parseWord(word)}
        </Fragment>
      ))}
    </>
  )
}

export default ParseTxText

/* utils */
export const splitTokenText = (string = '') => {
  const [, amount] = string.split(/(\d+)(\w+)/)
  const [, token] = string.split(REGEXP.COIN)
  return { amount, token }
}
