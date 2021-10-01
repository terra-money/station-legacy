import { FC } from 'react'
import Icon from './Icon'
import styles from './FormInformation.module.scss'

const FormInformation: FC = ({ children }) => (
  <article className={styles.component}>
    <Icon name="info" />
    <section>{children}</section>
  </article>
)

export default FormInformation
