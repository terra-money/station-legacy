import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { DownloadLink, DownloadLinks, useDownload } from '../use-station/src'
import { ReactComponent as Mac } from './Mac.svg'
import { ReactComponent as Windows } from './Windows.svg'
import { ReactComponent as Linux } from './Linux.svg'
import s from './Download.module.scss'

const svg: { [key: string]: ReactNode } = {
  mac: <Mac width={96} height={96} />,
  win: <Windows width={96} height={96} />,
  linux: <Linux width={43} height={50} />,
}

const Download = () => {
  const { title, links } = useDownload()

  const renderLink = ({ label, link, ext, key }: DownloadLink) => (
    <a href={link} className={classNames(s.item, s.link)} download key={key}>
      {svg[key]}
      <h1 className={s.label}>{label}</h1>
      <p className={classNames(s.ext, s.icon)}>.{ext}</p>
    </a>
  )

  const renderLinks = ({ label, links, key }: DownloadLinks) => (
    <article className={classNames(s.item, s.links)} key={key}>
      {svg[key]}
      <h1 className={s.label}>{label}</h1>

      <p>
        {links.map(({ link, ext }) => (
          <a href={link} className={s.ext} download key={link}>
            .{ext}
          </a>
        ))}
      </p>
    </article>
  )

  return (
    <>
      <h1 className={s.title}>{title}</h1>
      <section className={s.list}>
        {links.map((item) =>
          'link' in item ? renderLink(item) : renderLinks(item)
        )}
      </section>
    </>
  )
}

export default Download
