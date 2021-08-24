import { useTranslation } from 'react-i18next'
import { Field } from '../types'

interface SharePage {
  title: string
  list: { key: string; label: string; href: string }[]
  field: Field
}

export default (link: string): SharePage => {
  const { t } = useTranslation()

  const list = [
    {
      key: 'twitter',
      label: t('Page:Twitter'),
      href: 'https://twitter.com/share?url=' + link,
    },
    {
      key: 'telegram',
      label: t('Page:Telegram'),
      href: 'https://telegram.me/share/?url=' + link,
    },
    {
      key: 'mail',
      label: t('Page:Mail'),
      href: 'mailto:?subject=From Terra Station&body=' + link,
    },
  ]

  const field: Field = {
    label: t('Page:Copy link'),
    element: 'input',
    attrs: { type: 'text', id: 'link', defaultValue: link, readOnly: true },
    copy: link,
  }

  return { title: t('Page:Share'), list, field }
}
