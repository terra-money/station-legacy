import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { remove } from 'ramda'
import { CoinFields, CoinInput } from '../types'
import { format, gt } from '../utils'
import { toAmount } from '../utils/format'

export const useCoinsFields = (denoms: string[]): CoinFields => {
  const { t } = useTranslation()
  const InitialCoinInput = { denom: denoms[0], input: '' }
  const [coinInputs, setCoinInputs] = useState<CoinInput[]>([InitialCoinInput])

  return {
    label: t('Post:Contracts:Coins'),
    groups: coinInputs.map(({ denom, input }, index) => ({
      denom: {
        label: '',
        element: 'select',
        attrs: { id: 'denom', value: denom },
        setValue: (value) =>
          setCoinInputs((cur) =>
            update<CoinInput>(cur, index, { denom: value })
          ),
        options: denoms.map((denom) => ({
          value: denom,
          children: format.denom(denom),
        })),
      },
      input: {
        label: '',
        element: 'input',
        attrs: { id: 'input', value: input },
        setValue: (value) =>
          setCoinInputs((cur) =>
            update<CoinInput>(cur, index, { input: value })
          ),
      },
      button: index
        ? {
            children: '-',
            onClick: () => setCoinInputs(remove(index, 1, coinInputs)),
          }
        : {
            children: '+',
            onClick: () => setCoinInputs([...coinInputs, InitialCoinInput]),
          },
    })),
    coins: coinInputs
      .filter(({ input }) => !!input)
      .map(({ denom, input }) => ({ denom, amount: toAmount(input) })),
    invalid: coinInputs
      .filter(({ input }) => !!input)
      .some(({ input }) => !gt(input, '0')),
  }
}

/* helper */
const update = <T>(cur: T[], index: number, updates: object): T[] =>
  cur.map((input, i) => (index === i ? { ...input, ...updates } : input))
