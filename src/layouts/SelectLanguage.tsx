import React from 'react'
import c from 'classnames'
import LanguageList, { Languages } from '../lang/list'
import { useApp } from '../hooks'
import Pop from '../components/Pop'
import Icon from '../components/Icon'
import s from './SelectLanguage.module.scss'

interface LangProps {
  icon: string
  label: string
  className?: string
  caret?: boolean
  active?: boolean
}

const Lang = ({ icon, label, caret, active, className }: LangProps) => (
  <div className={c(s.lang, className)}>
    <section>
      <img src={icon} alt="" width={18} />
      {label}
    </section>

    {caret ? (
      <Icon name="arrow_drop_down" />
    ) : (
      <div className={s.radio}>{active && <div className={s.active} />}</div>
    )}
  </div>
)

const SelectLanguage = () => {
  const { lang, selectLang } = useApp()

  return (
    <article className={s.container}>
      <Pop
        type="pop"
        placement="top"
        width={200}
        content={
          <article>
            <h1>Select your language</h1>

            <ul className={s.list}>
              {LanguageList.map(({ key, ...rest }) => (
                <li className={s.item} key={key}>
                  <button onClick={() => selectLang(key)} className={s.button}>
                    <Lang {...rest} active={key === lang} />
                  </button>
                </li>
              ))}
            </ul>
          </article>
        }
        fixed
      >
        {({ ref, getAttrs }) => (
          <span {...getAttrs({ className: s.wrapper })} ref={ref}>
            <Lang {...Languages[lang]} caret className={s.select} />
          </span>
        )}
      </Pop>
    </article>
  )
}

export default SelectLanguage
