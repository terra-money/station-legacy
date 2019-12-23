import { useTranslation } from 'react-i18next'
import BN from 'bignumber.js'
import { times, gt, lte, isInteger } from './math'
import { format, is } from '../utils'

export default () => {
  const { t, i18n } = useTranslation()
  const isKorean = i18n.languages?.includes('ko')

  const between = ({
    input,
    range: [min, max],
    label = t('Amount'),
    formatAmount
  }: {
    input?: BN.Value
    range: BN.Value[]
    label?: string
    formatAmount?: boolean
  }): string => {
    const amount = formatAmount ? times(input || 0, 1e6) : input || 0
    return !input
      ? `${label}${t(' is required')}`
      : !(gt(amount, min) && lte(amount, max))
      ? [
          label,
          t(' must be between '),
          formatAmount ? format.amount(1) : min,
          t(' and '),
          formatAmount ? format.amount(max) : max,
          isKorean ? ' 이하여야 합니다' : ''
        ].join('')
      : ''
  }

  return {
    between,

    input: (input: string, max: string): string => {
      const amount = times(input || 0, 1e6)
      return !gt(max, 0)
        ? t('Insufficient balance')
        : !isInteger(amount)
        ? t('Amount must be within 6 decimal points')
        : between({ input, range: [0, max], formatAmount: true })
    },

    address: (to: string) =>
      !to
        ? t('Address is required')
        : !is.address(to)
        ? t('Address is invalid')
        : ''
  }
}
