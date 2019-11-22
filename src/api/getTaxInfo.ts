import { times, min, ceil } from './math'
import api from './api'

export default async (denom: string): Promise<TaxInfo> => {
  const { data: rate } = await api.get('/treasury/tax_rate')
  const { data: cap } = await api.get(`/treasury/tax_cap/${denom}`)
  return { rate: rate.result, cap: cap.result }
}

export const calcTax = (amount: string, { rate, cap }: TaxInfo): string =>
  ceil(min([times(amount, rate), cap]))
