import React, { ChangeEvent } from 'react'
import c from 'classnames'
import { useConfig } from '@terra-money/use-station'
import { Chains, list } from '../Chains'
import { localSettings } from '../utils/localStorage'
import Select from '../components/Select'
import s from './Chain.module.scss'

const SelectChain = () => {
  const { chain } = useConfig()
  const { current, set } = chain

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    localSettings.set({ chain: e.target.value })
    set(Chains[e.target.value])
  }

  return (
    <Select
      value={current['key']}
      onChange={handleChange}
      className={c('form-control', s.select)}
    >
      {list.map(key => (
        <option value={key} key={key}>
          {Chains[key]['name']}
        </option>
      ))}
    </Select>
  )
}

export default SelectChain
