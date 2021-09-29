import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../lang/en'
import es from '../lang/es.json'
import zh from '../lang/zh.json'
import fr from '../lang/fr.json'
import ru from '../lang/ru.json'
import pl from '../lang/pl.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
      fr: { translation: fr },
      ru: { translation: ru },
      pl: { translation: pl },
    },
    lng: 'en',
    keySeparator: ':',
  })
