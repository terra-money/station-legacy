import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { LangKey } from '../lib'
import { localSettings } from '../utils/localStorage'

export const Languages: Record<LangKey, { name: string }> = {
  en: { name: 'English' },
  es: { name: 'Spanish' },
  zh: { name: 'Chinese' },
  fr: { name: 'French' },
  ru: { name: 'Русский' },
  pl: { name: 'Polish' },
}

export const languageList = Object.keys(Languages) as LangKey[]

const langState = atom<LangKey>({
  key: 'langState',
  default: (localSettings.get().lang ?? 'en') as LangKey,
})

export const useLang = () => {
  return useRecoilValue(langState)
}

export const useManageLanguage = () => {
  const [lang, setLang] = useRecoilState(langState)
  const { i18n } = useTranslation()

  const set = useCallback(
    (key: string) => {
      localSettings.set({ lang: key })
      i18n.changeLanguage(key)
      setLang(key as LangKey)
    },
    [i18n, setLang]
  )

  // On init
  useEffect(() => {
    set(Languages[lang] ? lang : 'en')
  }, [lang, set])

  return { set }
}

/* helper */
export const getLang = (langKey: LangKey) =>
  Languages[langKey] ?? Languages['en']
