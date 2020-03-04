import React, { ChangeEvent } from 'react'
import c from 'classnames'
import { useConfig, ChainKey, Chains } from '@terra-money/use-station'
import { isProduction } from '../utils/env'
import { localSettings } from '../utils/localStorage'
import Select from '../components/Select'
import s from './Chain.module.scss'

const SelectChain = () => {
  const { chain } = useConfig()
  const { current, list, set } = chain

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    localSettings.set({ chain: e.target.value })
    set(e.target.value as ChainKey)
  }

  return (
    <Select
      value={current}
      onChange={handleChange}
      className={c('form-control', s.select)}
    >
      {list.concat(!isProduction ? 'fitz' : []).map(key => (
        <option value={key} key={key}>
          {Chains[key]['name']}
        </option>
      ))}
    </Select>
  )
}

export default SelectChain
