import React from 'react'
import { LangKey, Languages } from '@terra-money/use-station'
import { useConfig, getLang } from '@terra-money/use-station'
import { localSettings } from '../utils/localStorage'
import ConfigSelector from './ConfigSelector'

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

  return !current ? null : (
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
