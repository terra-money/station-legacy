import React from 'react'
import { LangKey, Languages } from '@terra-money/use-station'
import { useConfig, getLang } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import { localSettings } from '../utils/localStorage'
import Select from '../components/Select'
import ConfigSelector from './ConfigSelector'
import s from './Nav.module.scss'

const Lang = () => {
  const { lang } = useConfig()
  const { current, list, set } = lang

  const handleSelect = (key: string) => {
    localSettings.set({ lang: key })
    set(key as LangKey)
  }

  const languages = list.map((key: LangKey) => ({
    key,
    value: Languages[key]['name'],
  }))

  return !current ? null : isExtension ? (
    <Select
      value={current}
      onChange={(e) => handleSelect(e.target.value)}
      className="form-control"
      containerClassName={isExtension ? s.select : undefined}
    >
      {languages.map(({ key, value }) => (
        <option value={key} key={key}>
          {value}
        </option>
      ))}
    </Select>
  ) : (
    <ConfigSelector
      icon="language"
      title="Select language"
      value={getLang(current)['name']}
      onSelect={handleSelect}
      options={languages}
    />
  )
}

export default Lang
