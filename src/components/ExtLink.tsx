import React, { FC, AnchorHTMLAttributes } from 'react'

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

/* helper */
const fix = (href: string): string => {
  try {
    new URL(href!)
    return href ?? ''
  } catch (error) {
    return href ? `https://${href}` : ''
  }
}
