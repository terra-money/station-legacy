import React, { FC, ReactNode, ImgHTMLAttributes } from 'react'
import Icon from './Icon'
import s from './Confirm.module.scss'

interface Props {
  image?: ImgHTMLAttributes<HTMLImageElement>
  icon?: string
  title?: string
  content?: ReactNode
  footer?: ReactNode
}

const Confirm: FC<Props> = (props) => {
  const { image, icon, title, content, children, footer } = props
  return (
    <article className={s.article}>
      <header className={s.header}>
        {image && <img alt="" {...image} />}
        {icon && <Icon name={icon} size={50} />}
        <h1 className={s.title}>{title}</h1>
      </header>

      <section className={s.main}>{content ?? children}</section>
      {!!footer && <footer className={s.actions}>{footer}</footer>}
    </article>
  )
}

export default Confirm
