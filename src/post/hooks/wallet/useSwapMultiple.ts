import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dictionary, without } from 'ramda'
import { Coin, Coins } from '@terra-money/terra.js'
import { Msg, MsgExecuteContract, MsgSwap } from '@terra-money/terra.js'
import { PostPage, CoinItem, Field } from '../../../types'
import { BankData, Pairs, ConfirmProps } from '../../../types'
import { format, gt, is, minus, sum } from '../../../utils'
import { toInput } from '../../../utils/format'
import { useAddress } from '../../../data/auth'
import { useCurrentChain, useCurrentChainName } from '../../../data/chain'
import { getFeeDenomList, isFeeAvailable } from '../validateConfirm'
import { useActiveDenoms, useForm } from '../../../lib'
import useCalcTaxes from '../useCalcTaxes'
import { simulateMarket } from './useSwap'
import { getTerraswapURL, simulateTerraswap } from './terraswap'
import { findPair, getRouteMessage, simulateRoute } from './routeswap'

interface Values {
  to: string
}

interface Params {
  bank: BankData
  pairs: Pairs
}

export default ({ bank, pairs }: Params): PostPage => {
  const { t } = useTranslation()
  const address = useAddress()
  const currentChainName = useCurrentChainName()
  const currentChain = useCurrentChain()
  const { lcd } = currentChain
  const balance = bank.balance.filter(({ denom }) => is.nativeDenom(denom))

  const activeDenoms = useActiveDenoms()
  const balanceDenoms = balance.map(({ denom }) => denom)
  const { getTax, loading: loadingTaxes } = useCalcTaxes(balanceDenoms, t)

  type OptionItem = { key: string; label: string; available: string }
  const options: OptionItem[] = balance.map(({ denom, available }) => ({
    key: denom,
    label: format.denom(denom),
    available,
  }))

  const availableList = balance.reduce<Dictionary<string>>(
    (acc, { denom, available }) => ({ ...acc, [denom]: available }),
    {}
  )

  const getAmountAfterTax = (denom: string) =>
    minus(availableList[denom], getTax(availableList[denom], denom))

  /* form */
  const hasLunaOnly = balance.length === 1 && balance[0].denom === 'uluna'
  const initial = { to: hasLunaOnly ? 'uusd' : 'uluna' }
  const validate = () => ({ to: '' })
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<Values>(initial, validate)
  const { values, setValue, getDefaultAttrs } = form
  const { to } = values

  const [checked, setChecked] = useState<string[]>([])
  const readyToSimulate = !loadingTaxes

  /* simulate */
  const [isSimulating, setIsSimulating] = useState(false)
  const [isSimulated, setIsSimulated] = useState(false)
  const [simulatedList, setSimulatedList] = useState<Dictionary<string>>({})
  const simulatedValues = checked.map((denom) => simulatedList[denom])
  const sumOfSimulated = simulatedValues.length ? sum(simulatedValues) : '0'

  const isTerraswap = (from: string) => findPair({ from, to }, pairs)
  const balanceDenomsWithoutTo = balanceDenoms.filter((denom) => denom !== to)
  const terraswapList = balanceDenomsWithoutTo
    .filter((denom) => gt(getAmountAfterTax(denom), '1'))
    .filter(isTerraswap)
  const routeswapList = balanceDenomsWithoutTo
    .filter((denom) => gt(getAmountAfterTax(denom), '1'))
    .filter((denom) => !isTerraswap(denom))

  useEffect(() => {
    const simulate = async () => {
      setIsSimulated(false)
      setIsSimulating(true)

      if (to === 'uluna') {
        // terraswap
        const simulateTerraswapList = terraswapList.map((from) => {
          const amount = getAmountAfterTax(from)
          return simulateTerraswap(
            { pair: findPair({ from, to }, pairs), offer: { amount, from } },
            currentChain,
            address
          )
        })

        const responsesTerraswap = await Promise.all(simulateTerraswapList)
        const simulatedTerraswap = terraswapList.reduce(
          (acc, denom, index) => ({
            ...acc,
            [denom]: responsesTerraswap[index].return_amount,
          }),
          {}
        )

        // routeswap
        const simulateRouteswapList = routeswapList.map(async (from) => {
          try {
            const amount = getAmountAfterTax(from)
            const params = { from, to, amount, chain: currentChainName, lcd }
            const result = await simulateRoute(params)
            return result
          } catch {
            return '0'
          }
        })

        const responsesRouteswap = await Promise.all(simulateRouteswapList)

        const simulatedRouteswap = routeswapList.reduce(
          (acc, denom, index) =>
            typeof responsesRouteswap[index] === 'string'
              ? { ...acc, [denom]: responsesRouteswap[index] }
              : acc,
          {}
        )

        // combine
        setSimulatedList({ ...simulatedTerraswap, ...simulatedRouteswap })
      } else {
        const simulateList = balanceDenomsWithoutTo.map((from) =>
          simulateMarket(
            { from, to, amount: availableList[from] ?? '0' },
            false
          )
        )

        const responses = await Promise.all(simulateList)
        const simulated = balanceDenomsWithoutTo.reduce(
          (acc, denom, index) => ({
            ...acc,
            [denom]: responses[index].swapped,
          }),
          {}
        )

        setSimulatedList(simulated)
      }

      setIsSimulating(false)
      setIsSimulated(true)
    }

    readyToSimulate ? simulate() : setSimulatedList({})
    // eslint-disable-next-line
  }, [to, readyToSimulate])

  useEffect(() => {
    const valid = omitSmall(simulatedList)
    setChecked(Object.keys(valid))
  }, [simulatedList])

  /* Msg */
  const terraswapChecked = checked.filter(isTerraswap)
  const routeswapChecked = checked.filter((denom) => !isTerraswap(denom))

  const msgsTerraswap = terraswapChecked.reduce<Msg[]>((acc, from) => {
    const amount = getAmountAfterTax(from)
    const terraswap = getTerraswapURL(
      { pair: findPair({ from, to }, pairs), offer: { amount, from } },
      lcd,
      address
    )

    return [...acc, ...terraswap.msgs]
  }, [])

  const msgsRouteswap = routeswapChecked.map((from) => {
    const amount = getAmountAfterTax(from)
    const params = { amount, from, to, chain: currentChainName, lcd }
    const { execute } = getRouteMessage(params)
    const { contract, msg, coins } = execute
    return new MsgExecuteContract(address, contract, msg, coins)
  })

  const msgsMarket = checked.map(
    (from) =>
      new MsgSwap(address, new Coin(from, availableList[from] ?? '0'), to)
  )

  const msgs =
    to === 'uluna' ? [...msgsTerraswap, ...msgsRouteswap] : msgsMarket

  /* render */
  interface FieldUI {
    available: string
    simulating: boolean
    simulated?: string
  }

  const checkboxes = {
    label: 'From',
    list: options.map<Field<FieldUI>>(({ key, label, available }) => {
      const isChecked = checked.includes(key)
      return {
        label,
        element: 'input',
        attrs: {
          type: 'checkbox',
          name: 'checked',
          id: key,
          checked: isChecked,
          disabled: to === key || !gt(simulatedList[key], 1),
        },
        setValue: () =>
          setChecked((checked) =>
            isChecked ? without([key], checked) : [...checked, key]
          ),
        ui: {
          available: format.coin({ amount: available, denom: key }),
          simulating: isSimulating,
          simulated:
            isSimulated && simulatedList[key]
              ? format.coin({ amount: simulatedList[key], denom: to })
              : undefined,
        },
      }
    }),
  }

  const group = {
    label: 'To',
    groups: [
      {
        denom: {
          label: '',
          element: 'select',
          attrs: getDefaultAttrs('to'),
          setValue: (value: string) => setValue('to', value),
          options: ['uluna', ...(activeDenoms.data?.result ?? [])].map(
            (denom) => {
              return { value: denom, children: format.denom(denom) }
            }
          ),
        },
        input: {
          label: '',
          element: 'input',
          attrs: {
            id: 'input',
            value: toInput(sumOfSimulated),
            readOnly: true,
          },
        },
      },
    ],
  }

  const allChecked = balanceDenomsWithoutTo.every((d) => checked.includes(d))
  const hasBalance = balanceDenoms.includes(to)
  const isFeeNotAvailable = allChecked && !hasBalance

  const invalid = !checked.length || !to || isFeeNotAvailable
  const disabled = invalid || isSimulating || !isSimulated

  const formUI = {
    fields: [],
    disabled,
    title: t('Post:Swap:Swap multiple coins'),
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const feeDenomList = getFeeDenomList(balance).filter(
    (denom) => !checked.includes(denom)
  )

  const defaultFeeDenom = gt(availableList[to], 1) ? to : feeDenomList[0]

  const getConfirm = (bank: BankData): ConfirmProps => ({
    msgs,
    tax:
      to === 'uluna'
        ? new Coins(
            checked.map(
              (denom) => new Coin(denom, getTax(availableList[denom], denom))
            )
          )
        : undefined,
    contents: [
      {
        name: t('Common:Tx:Amount'),
        displays: checked.map((denom) => {
          const amount =
            to === 'uluna' ? getAmountAfterTax(denom) : availableList[denom]

          return format.display({ amount, denom })
        }),
      },
    ]
      .concat(
        to === 'uluna'
          ? [
              {
                name: t('Post:Send:Tax'),
                displays: checked.map((denom) => {
                  const amount = getTax(availableList[denom], denom)
                  return format.display({ amount, denom })
                }),
              },
            ]
          : []
      )
      .concat([
        {
          name: t('Post:Swap:Receive'),
          displays: [format.display({ amount: sumOfSimulated, denom: to })],
        },
      ]),
    feeDenom: {
      defaultValue: defaultFeeDenom,
      list: feeDenomList,
    },
    validate: (fee: CoinItem) => isFeeAvailable(fee, balance),
    submitLabels: [t('Post:Swap:Swap'), t('Post:Swap:Swapping...')],
    message: t('Post:Swap:Swapped {{coin}} to {{unit}}', {
      coin: checked.map((denom) => format.denom(denom)).join(', '),
      unit: format.denom(to),
    }),
    cancel: () => setSubmitted(false),
    warning: t(
      'Post:Swap:Final amount you receive in {{unit}} may vary due to the swap rate changes',
      { unit: format.denom(to) }
    ),
  })

  return {
    submitted,
    form: formUI,
    confirm: bank ? getConfirm(bank) : undefined,
    ui: { checkboxes, group },
  }
}

/* helpers */
const omitSmall = (object: Dictionary<string>) =>
  Object.entries(object).reduce(
    (acc, [denom, value]) => (gt(value, 1) ? { ...acc, [denom]: value } : acc),
    {}
  )
