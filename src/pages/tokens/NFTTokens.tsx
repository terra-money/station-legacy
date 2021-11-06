import { NFTToken } from '../../lib'
import { NFTTokenItem } from './NFTTokenItem'
import TokensNotFound from './TokensNotFound'
import styles from './Tokens.module.scss'

interface Props {
  tokens: NFTToken[]
  muteOnAdded?: boolean
}

const NFTTokens = ({ tokens, muteOnAdded }: Props) => {
  return (
    <div className={styles.component}>
      {!tokens.length ? (
        <TokensNotFound />
      ) : (
        <ul className={styles.list}>
          {tokens.map((token) => (
            <li className={styles.item} key={token.token}>
              <NFTTokenItem {...token} muteOnAdded={muteOnAdded} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NFTTokens
