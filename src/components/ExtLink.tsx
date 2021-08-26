import React, { FC, AnchorHTMLAttributes } from 'react'
import Icon from './Icon'
import styles from './ExtLink.module.scss'

type Anchor = AnchorHTMLAttributes<HTMLAnchorElement>
const ExtLink: FC<Anchor> = ({ href, children, ...attrs }) =>
  href ? (
    <a {...attrs} href={fix(href)} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <span {...attrs}>{children}</span>
  )

export default ExtLink

/* variant */
export const ExtLinkWithIcon = (props: Anchor) => {
  return (
    <span className={styles.wrapper}>
      <ExtLink {...props} />
      <Icon name="open_in_new" />
    </span>
  )
}

/* helper */
const fix = (href: string): string => {
  try {
    new URL(href!)
    return href ?? ''
  } catch (error) {
    return href ? `https://${href}` : ''
  }
}
