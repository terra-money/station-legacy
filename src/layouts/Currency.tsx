import React from 'react'
import { useConfig } from '@terra-money/use-station'
import { localSettings } from '../utils/localStorage'
import ConfigSelector from './ConfigSelector'

const Currency = () => {
  const { currency } = useConfig()
  const { current, list, set } = currency

  const handleSelect = (key: string) => {
    localSettings.set({ currency: key })
    set(key)
  }

  return !current || !list ? null : (
    <ConfigSelector
      title="Select currency"
      value={current.value}
      onSelect={handleSelect}
      options={list}
    />
  )
}

export default Currency
