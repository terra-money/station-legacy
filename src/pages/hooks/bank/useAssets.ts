import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssetsPage, BankData, Schedule, TokenBalance } from '../../../types'
import { format } from '../../../utils'
import { minus, percent, gt, gte, toNumber } from '../../../utils/math'
import { useCurrency, useCurrencyRates } from '../../../data/currency'
import useBank from '../../../api/useBank'
import { useActiveDenoms } from '../../../lib'
import useTokenBalance from '../../../cw20/useTokenBalance'

const SMALL = '1000000'

interface Config {
  hideSmall?: boolean
  hideSmallTokens?: boolean
}

export default (config?: Config): AssetsPage => {
  const { t } = useTranslation()
  const oracleActiveDenoms = useActiveDenoms()
  const bank = useBank()
  const tokenBalances = useTokenBalance()
  const currency = useCurrency()
  const { getValue, getCurrentCurrencyValue } = useCurrencyRates()
  const [hideSmall, setHideSmall] = useState<boolean>(
    config?.hideSmall !== undefined ? config.hideSmall : false
  )

  const load = () => {
    bank.execute()
    tokenBalances.load()
  }

  const render = (
    denoms: string[],
    { balance, vesting }: BankData,
    tokenList?: TokenBalance[]
  ) => {
    return {
      available: {
        disclaimer: !balance.length
          ? 'This wallet does not hold any native tokens, so the transaction could not be processed.'
          : undefined,
        title: 'Terra Native',
        list: ['uluna', ...denoms]
          .map((denom) => {
            const available =
              balance.find((item) => item.denom === denom)?.available ?? '0'
            const currencyValule = getCurrentCurrencyValue({
              denom,
              amount: available,
            })

            return {
              available,
              denom,
              display: format.display({ amount: available, denom }),
              currencyValueDisplay: !gte(currencyValule, 0)
                ? undefined
                : format.display({ amount: currencyValule, denom: currency }),
              uusdValue: getValue({ denom, amount: available }, 'uusd'),
            }
          })
          .filter(
            ({ available, denom }) =>
              ['uluna', 'uusd'].includes(denom) || gt(available, 0)
          )
          .filter(({ uusdValue }) => !hideSmall || gte(uusdValue, SMALL))
          .sort(({ uusdValue: a }, { uusdValue: b }) => toNumber(minus(b, a)))
          .sort(
            ({ denom: a }, { denom: b }) =>
              Number(b === 'uusd') - Number(a === 'uusd')
          )
          .sort(
            ({ denom: a }, { denom: b }) =>
              Number(b === 'uluna') - Number(a === 'uluna')
          ),
        hideSmall: {
          label: t('Page:Bank:Hide small balances'),
          checked: hideSmall,
          toggle: () => setHideSmall((v) => !v),
        },
        send: t('Post:Send:Send'),
      },
      ibc: !balance.filter(({ denom }) => denom.startsWith('ibc/')).length
        ? undefined
        : {
            title: 'IBC Tokens',
            list: balance
              .filter(({ denom }) => denom.startsWith('ibc/'))
              .map(({ available, denom }) => {
                return {
                  denom,
                  display: { value: format.amount(available), unit: denom },
                }
              }),
            send: t('Post:Send:Send'),
          },
      tokens: {
        title: 'CW20 Tokens',
        list:
          tokenList?.map(({ token, symbol, icon, balance, decimals }) => {
            const display = {
              value: format.amount(balance, decimals),
              unit: symbol,
            }

            return { icon, token, display }
          }) ?? [],
        send: t('Post:Send:Send'),
      },
      vesting: !vesting.length
        ? undefined
        : {
            title: t('Page:Bank:Vesting schedule'),
            desc: t(
              'Page:Bank:This displays your investment with Terra. Vested Luna can be delegated in the meantime.'
            ),
            list: vesting.map(({ total, denom, schedules }) => ({
              display: format.display({ amount: total, denom }),
              schedule: schedules.map((item) => getSchedule(item, denom)),
            })),
          },
    }
  }

  const getSchedule = (schedule: Schedule, denom: string) => {
    const { amount, startTime, endTime, ratio, freedRate } = schedule
    const now = new Date().getTime()
    const released = endTime < now
    const releasing = startTime < now && now < endTime

    return {
      released,
      releasing,
      percent: percent(ratio),
      display: format.display({ amount, denom }),
      status: released
        ? t('Page:Bank:Released')
        : releasing
        ? t('Page:Bank:Releasing')
        : t('Page:Bank:Release on'),
      duration: [startTime, endTime].map((t) => `${toISO(t)}`).join(' ~ '),
      width: percent(freedRate, 0),
    }
  }

  return Object.assign(
    { setHideSmall, load },
    bank,
    {
      loading:
        oracleActiveDenoms.isLoading || bank.loading || tokenBalances.loading,
    },
    oracleActiveDenoms.data &&
      oracleActiveDenoms.data &&
      bank.data && {
        ui: render(oracleActiveDenoms.data, bank.data, tokenBalances.list),
      }
  )
}

/* helper */
const toISO = (date: number) => format.date(new Date(date).toISOString())
