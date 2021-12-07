import Icon from '../../components/Icon'
import AddCW721Token from '../tokens/AddCW721Token'
import { useApp } from '../../hooks'
import styles from './NFTPlaceholder.module.scss'

const NFTPlaceholder = () => {
  const { modal } = useApp()
  return (
    <>
      <Icon name="token" size={56} />
      <h2 className={styles.title}>CW721 token</h2>
      <button
        className={styles.addButton}
        onClick={() => modal.open(<AddCW721Token />)}
      >
        Add tokens
        <Icon name="chevron_right" size={16} />
      </button>
    </>
  )
}

export default NFTPlaceholder
