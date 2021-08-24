import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssetsPage, BankData, Schedule, TokenBalance, User } from '../../types'
import { format } from '../../utils'
import { percent, gte, gt } from '../../utils/math'
import useBank from '../../api/useBank'
import useTokenBalance from '../../cw20/useTokenBalance'

const SMALL = '1000000'

interface Config {
  hideSmall?: boolean
  hideSmallTokens?: boolean
}

export default (user: User, config?: Config): AssetsPage => {
  const { t } = useTranslation()
  const bank = useBank(user)
  const tokens = useTokenBalance(user.address)
  const [hideSmall, setHideSmall] = useState<boolean>(
    config?.hideSmall !== undefined ? config.hideSmall : false
  )
  const [hideSmallTokens, setHideSmallTokens] = useState(
    config?.hideSmallTokens !== undefined ? config.hideSmallTokens : false
  )

  const load = () => {
    bank.execute()
    tokens.load()
  }

  const render = (
    { balance, vesting }: BankData,
    tokenList?: TokenBalance[]
  ) => ({
    card:
      !balance.length && !tokenList?.length && !vesting.length
        ? {
            title: t('Page:Bank:Wallet empty'),
            content: t("Page:Bank:This wallet doesn't hold any coins yet"),
          }
        : !balance.length && !vesting.length && tokenList?.length
        ? {
            title: t('Page:Bank:Wallet empty'),
            content:
              'This wallet does not hold any native tokens, so the transaction could not be processed.',
          }
        : undefined,
    available: !balance.length
      ? undefined
      : {
          title: t('Page:Bank:Available'),
          list: balance
            .filter(({ available }) => !hideSmall || gte(available, SMALL))
            .map(({ available, denom }) => ({
              denom,
              display: format.display({ amount: available, denom }),
            })),
          hideSmall: {
            label: t('Page:Bank:Hide small balances'),
            checked: hideSmall,
            toggle: () => setHideSmall((v) => !v),
          },
          send: t('Post:Send:Send'),
        },
    tokens: !tokenList?.filter(({ balance }) => gt(balance, 0)).length
      ? undefined
      : {
          title: 'Tokens',
          list: tokenList
            .filter(({ balance }) => !hideSmallTokens || gt(balance, SMALL))
            .map(({ token, symbol, icon, balance, decimals }) => ({
              icon,
              token,
              display: {
                value: format.amount(balance, decimals),
                unit: symbol,
              },
            })),
          hideSmall: {
            label: t('Page:Bank:Hide small balances'),
            checked: hideSmallTokens,
            toggle: () => setHideSmallTokens((v) => !v),
          },
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
  })

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
    { loading: bank.loading || tokens.loading },
    bank.data && {
      ui: render(
        bank.data,
        tokens.list?.filter(({ balance }) => gt(balance, 0))
      ),
    }
  )
}

/* helper */
const toISO = (date: number) => format.date(new Date(date).toISOString())
