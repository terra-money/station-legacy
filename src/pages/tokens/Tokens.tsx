import { Token } from '../../lib'
import { TokenItem } from './TokenItem'
import TokensNotFound from './TokensNotFound'
import styles from './Tokens.module.scss'

interface Props {
  tokens: Token[]
  muteOnAdded?: boolean
}

const Tokens = ({ tokens, muteOnAdded }: Props) => {
  return (
    <div className={styles.component}>
      {!tokens.length ? (
        <TokensNotFound />
      ) : (
        <ul className={styles.list}>
          {tokens.map((token) => (
            <li className={styles.item} key={token.token}>
              <TokenItem {...token} muteOnAdded={muteOnAdded} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Tokens
