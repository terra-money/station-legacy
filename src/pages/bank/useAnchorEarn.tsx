import { useEffect, useMemo, useState } from 'react'
import { Msg } from '@terra-money/terra.js'
import {
  AddressMap,
  AddressProviderFromJson,
  Earn,
  fabricateMarketDepositStableCoin,
  fabricateMarketRedeemStable,
  MARKET_DENOMS,
  columbus4,
  tequila0004,
  queryMarketEpochState,
} from '@anchor-protocol/anchor.js'
import { plus, useBank } from '../../lib'
import { gt } from '../../utils'
import { toAmount } from '../../utils/format'
import { useAddress } from '../../data/auth'
import { useCurrentChainName } from '../../data/chain'
import useLCD from '../../api/useLCD'

const UUSD = MARKET_DENOMS.UUSD
const market = UUSD

interface Props {
  address: string
  addresses: AddressMap
}

export interface AnchorEarnInfo {
  uusd: string
  aust: string
  total: string
  exchangeRate: string
  getMsg: (amount: string, type: AnchorEarnTxType) => Msg[]
}

export type AnchorEarnTxType = 'Deposit' | 'Withdraw'

const useAnchorEarn = ({ address, addresses }: Props): AnchorEarnInfo => {
  const bank = useBank()
  const lcd = useLCD()

  const uusd =
    bank.data?.balance.find(({ denom }) => denom === UUSD)?.available ?? '0'

  const [aUSTBalance, setAUSTBalance] = useState('0')
  const [exchangeRate, setExchangeRate] = useState('0')

  const addressProvider = useMemo(
    () => new AddressProviderFromJson(addresses),
    [addresses]
  )

  const earn = useMemo(
    () => new Earn(lcd, addressProvider),
    [addressProvider, lcd]
  )

  useEffect(() => {
    const fetchAUSTBalance = async () => {
      const totalDeposit = await earn.getTotalDeposit({ address, market })
      setAUSTBalance(toAmount(totalDeposit))
    }

    const queryExchangeRate = async () => {
      const { exchange_rate } = await queryMarketEpochState({ lcd, market })(
        addressProvider
      )

      setExchangeRate(exchange_rate)
    }

    fetchAUSTBalance()
    queryExchangeRate()
  }, [address, addressProvider, earn, lcd])

  const getMsg = (input: string, type: AnchorEarnTxType) => {
    const params = { address, amount: input, market: UUSD }
    return gt(input, 0)
      ? {
          Deposit: fabricateMarketDepositStableCoin(params)(addressProvider),
          Withdraw: fabricateMarketRedeemStable(params)(addressProvider),
        }[type]
      : []
  }

  const total = plus(uusd, aUSTBalance)
  return { uusd, aust: aUSTBalance, total, exchangeRate, getMsg }
}

export default () => {
  const address = useAddress()
  const currentChain = useCurrentChainName()
  const addresses = { mainnet: columbus4, testnet: tequila0004 }[currentChain]
  if (!address || !addresses) return null
  return useAnchorEarn({ address, addresses })
}
