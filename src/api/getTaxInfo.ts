import { times, min, ceil } from './math'
import api from './api'

export default async (denom: string): Promise<TaxInfo> => {
  const { data: rate } = await api.get('/treasury/tax-rate')
  const { data: cap } = await api.get(`/treasury/tax-cap/${denom}`)
  return { rate: rate.tax_rate, cap: cap.tax_cap }
}

export const calcTax = (amount: string, { rate, cap }: TaxInfo): string =>
  ceil(min([times(amount, rate), cap]))
