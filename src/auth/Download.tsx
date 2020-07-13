import React, { ReactNode } from 'react'
import { useDownload } from '@terra-money/use-station'
import { ReactComponent as Mac } from './Mac.svg'
import { ReactComponent as Windows } from './Windows.svg'
import { useAuthModal } from './useAuthModal'
import ModalContent from '../components/ModalContent'
import s from './Download.module.scss'

const svg: { [key: string]: ReactNode } = {
  mac: <Mac width={96} height={96} />,
  win: <Windows width={96} height={96} />,
}

const Download = () => {
  const modal = useAuthModal()
  const { title, links } = useDownload()
  return (
    <ModalContent {...modal}>
      <h1 className={s.title}>{title}</h1>
      <section className={s.list}>
        {links.map(({ label, link, key }) => (
          <a href={link} className={s.button} download key={key}>
            {svg[key]}
            {label}
          </a>
        ))}
      </section>
    </ModalContent>
  )
}

export default Download
