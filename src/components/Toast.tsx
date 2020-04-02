import React, { ButtonHTMLAttributes } from 'react'
import { toast } from 'react-toastify'
import c from 'classnames'
import Icon from '../components/Icon'
import s from './Toast.module.scss'

interface Props {
  type?: 'success' | 'warn' | 'error'
  icon?: string
  title?: string
  content?: string
  button?: ButtonHTMLAttributes<HTMLButtonElement>
  shouldNotClose?: boolean
}

const Toast = ({ type, icon, title, content, ...rest }: Props) => {
  const { shouldNotClose, button } = rest

  return (
    <article className={c(s.component, s[type ?? 'success'])}>
      {title && (
        <header>
          <section>
            {icon && <Icon name={icon} />}
            <h1>{title}</h1>
          </section>

          {!shouldNotClose && (
            <button onClick={() => toast.dismiss()}>&times;</button>
          )}
        </header>
      )}

      <p>
        {content}
        {button && <button {...button} />}
      </p>
    </article>
  )
}

export default Toast
