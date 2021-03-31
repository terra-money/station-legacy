import Component from 'qrcode.react'
import styles from './QRCode.module.scss'

interface Props {
  title: string
  data: string
  warn?: string
}

const QRCode = ({ title, data, warn }: Props) => {
  return (
    <div className={styles.component}>
      <h1 className={styles.title}>{title}</h1>

      <Component
        value={data}
        size={320}
        bgColor="#f4f5fb"
        fgColor="#2043b5"
        includeMargin
      />

      {warn && <p className={styles.warn}>{warn}</p>}
    </div>
  )
}

export default QRCode
