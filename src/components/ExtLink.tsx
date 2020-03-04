import React, { FC, AnchorHTMLAttributes } from 'react'

type Anchor = AnchorHTMLAttributes<HTMLAnchorElement>
const ExtLink: FC<Anchor> = ({ href, className, children }) => (
  <a
    href={fix(href)}
    className={className}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

export default ExtLink

/* helper */
const fix = (href: string | undefined): string => {
  try {
    new URL(href!)
    return href ?? ''
  } catch (error) {
    return href ? `https://${href}` : ''
  }
}
