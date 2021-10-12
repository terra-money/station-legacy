import { ReactNode } from 'react'
import Component from 'qrcode.react'
import Copy from '../components/Copy'
import styles from './QRCode.module.scss'

interface Props {
  title: string
  data: string
  info?: string
  warn?: ReactNode
  exportKey?: boolean
}

const QRCode = ({ title, data, info, warn, exportKey }: Props) => {
  return (
    <div className={styles.component}>
      <h1 className={styles.title}>{title}</h1>

      {exportKey ? (
        <>
          <p className={styles.copy}>
            <Copy
              text={data}
              classNames={{ button: 'label-button text-secondary' }}
            />
          </p>
          <pre className={styles.encoded}>{data}</pre>
        </>
      ) : (
        <Component
          value={data}
          size={320}
          bgColor="#f4f5fb"
          fgColor="#2043b5"
          includeMargin
        />
      )}

      {info && <p className={styles.info}>{info}</p>}

      {warn}
    </div>
  )
}

export default QRCode
