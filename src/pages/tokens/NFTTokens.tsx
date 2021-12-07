import { NFTTokenItem } from './NFTTokenItem'
import TokensNotFound from './TokensNotFound'
import { NFTContract } from '../../types'
import styles from './Tokens.module.scss'

interface Props {
  contracts: NFTContract[]
  muteOnAdded?: boolean
}

const NFTTokens = ({ contracts, muteOnAdded }: Props) => (
  <div className={styles.component}>
    {!contracts.length ? (
      <TokensNotFound />
    ) : (
      <ul className={styles.list}>
        {contracts.map((contract, index) => (
          <li className={styles.item} key={index}>
            <NFTTokenItem {...contract} muteOnAdded={muteOnAdded} />
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default NFTTokens
