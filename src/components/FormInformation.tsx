import { FC } from 'react'
import Icon from './Icon'
import styles from './FormInformation.module.scss'

const FormInformation: FC = ({ children }) => (
  <p className={styles.component}>
    <Icon name="info" />
    <span>{children}</span>
  </p>
)

export default FormInformation
