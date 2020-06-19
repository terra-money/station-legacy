import React from 'react'
import c from 'classnames'
import { LangKey, Languages } from '@terra-money/use-station'
import { useConfig, getLang } from '@terra-money/use-station'
import { localSettings } from '../utils/localStorage'
import Pop from '../components/Pop'
import Icon from '../components/Icon'
import s from './Lang.module.scss'

interface LangProps {
  icon?: string
  label: string
  className?: string
  caret?: boolean
  active?: boolean
}

const LangItem = ({ icon, label, caret, active, className }: LangProps) => (
  <div className={c(s.lang, className)}>
    <section>
      {icon && <Icon name={icon} className={s.icon} />}
      {label}
    </section>

    {caret ? (
      <Icon name="arrow_drop_down" />
    ) : (
      <div className={s.radio}>{active && <div className={s.active} />}</div>
    )}
  </div>
)

const Lang = () => {
  const { lang } = useConfig()
  const { current, list, set } = lang

  const handleClick = (key: LangKey) => {
    localSettings.set({ lang: key })
    set(key)
  }

  const languages = list.map((key) => (
    <li className={s.item} key={key}>
      <button className={s.button} onClick={() => handleClick(key)}>
        <LangItem label={Languages[key]['name']} active={key === current} />
      </button>
    </li>
  ))

  return !current ? null : (
    <article className={s.container}>
      <Pop
        type="pop"
        placement="top"
        width={200}
        content={
          <article>
            <h1>Select your language</h1>
            <ul className={s.list}>{languages}</ul>
          </article>
        }
        fixed
      >
        {({ ref, getAttrs }) => (
          <span {...getAttrs({ className: s.wrapper })} ref={ref}>
            <LangItem
              icon="language"
              label={getLang(current)['name']}
              className={s.select}
              caret
            />
          </span>
        )}
      </Pop>
    </article>
  )
}

export default Lang
