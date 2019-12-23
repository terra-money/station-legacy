import en from '../images/en.png'
import zh from '../images/zh.png'
import ko from '../images/ko.png'

type Lang = { icon: string; label: string; key: string }

export const Languages: { [key: string]: Lang } = {
  en: { icon: en, label: 'English', key: 'en' },
  zh: { icon: zh, label: 'Chinese', key: 'zh' },
  ko: { icon: ko, label: 'Korean', key: 'ko' }
}

export default [Languages.en, Languages.zh, Languages.ko]
