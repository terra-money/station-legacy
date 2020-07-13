import React, { ChangeEvent, Fragment } from 'react'
import c from 'classnames'
import { useConfig } from '@terra-money/use-station'
import { Chains, list } from '../chains'
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
      {list.map(({ title, list }, index) => (
        <Fragment key={title}>
          {!!index && <option disabled>──────────</option>}
          {list.map((key) => (
            <option value={key} key={key}>
              {Chains[key]['name']}
            </option>
          ))}
        </Fragment>
      ))}
    </Select>
  )
}

export default SelectChain
