import Icon from '../../components/Icon'
import styles from './TokensNotFound.module.scss'

const TokensNotFound = () => {
  return (
    <article className={styles.component}>
      <Icon name="inbox" size={56} />
      <p>No results found</p>
    </article>
  )
}

export default TokensNotFound
