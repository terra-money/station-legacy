import React, { ReactNode } from 'react'
import { useShare } from '@terra-money/use-station'
import { ReactComponent as Twitter } from './Twitter.svg'
import { ReactComponent as Telegram } from './Telegram.svg'
import { ReactComponent as Mail } from './Mail.svg'
import ExtLink from '../components/ExtLink'
import s from './Share.module.scss'
import { Dictionary } from 'ramda'
import Field from '../components/Field'

const Share = () => {
  const { href } = window.location
  const { title, list, field } = useShare(href)

  const icon: Dictionary<ReactNode> = {
    twitter: <Twitter />,
    telegram: <Telegram />,
    mail: <Mail />,
  }

  return (
    <article>
      <h1 className={s.title}>{title}</h1>

      <ul className={s.list}>
        {list.map(({ key, label, href }) => (
          <li className={s.item} key={key}>
            <ExtLink href={href} className={s.link}>
              {icon[key]}
              <h2 className={s.label}>{label}</h2>
            </ExtLink>
          </li>
        ))}
      </ul>

      <Field field={field} />
    </article>
  )
}

export default Share
