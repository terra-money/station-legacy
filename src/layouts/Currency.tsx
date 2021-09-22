import { useCurrency, useCurrencyRates, useSetCurrency } from '../data/currency'
import ConfigSelector from './ConfigSelector'

const Currency = () => {
  const currency = useCurrency()
  const set = useSetCurrency()
  const { list } = useCurrencyRates()

  return !currency || !list ? null : (
    <ConfigSelector
      title="Select currency"
      label={getCurrencyName(currency)}
      value={currency}
      onSelect={set}
      options={Object.keys(list).map((denom) => ({
        label: getCurrencyName(denom),
        value: denom,
      }))}
    />
  )
}

export default Currency

const getCurrencyName = (denom: string) => denom.slice(1).toUpperCase()
