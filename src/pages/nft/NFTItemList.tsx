import { isEmpty } from 'lodash'
import { ReactComponent as Default } from '../../images/CW.svg'
import useCW721Tokens from '../../cw721/useCW721Tokens'
import { NFTContract } from '../../types'
import NFTItem from './NFTItem'
import styles from './NFTItemList.module.scss'

const NFTItemList = ({ nft }: { nft: NFTContract }) => {
  const { data } = useCW721Tokens(nft.contract)

  const icon = nft.icon ? (
    <img src={nft.icon} alt="icon" className={styles.logo} />
  ) : (
    <Default className={styles.logo} />
  )

  const nftTitle = (
    <div className={styles.itemTitle}>
      {icon}
      {nft.name}
    </div>
  )

  const tokenList = data?.tokens

  return (
    <article className={styles.itemCard}>
      {nftTitle}
      {tokenList && !isEmpty(tokenList) ? (
        tokenList.map((name, key) => (
          <NFTItem {...nft} nftName={name} key={key} />
        ))
      ) : (
        <span className={styles.empty}>No token found.</span>
      )}
    </article>
  )
}

export default NFTItemList
