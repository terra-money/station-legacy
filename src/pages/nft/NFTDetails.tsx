import { isEmpty } from 'lodash'
import classnames from 'classnames'
import { useNFTTokens } from '../../data/nftTokens'
import ManageCW721Token from '../tokens/ManageCW721Tokens'
import AddCW721Token from '../tokens/AddCW721Token'
import Icon from '../../components/Icon'
import Card from '../../components/Card'
import { useApp } from '../../hooks'
import NFTItemList from './NFTItemList'
import NFTPlaceholder from './NFTPlaceholder'
import styles from './NFTDetails.module.scss'

const NFTDetails = () => {
  const { modal } = useApp()
  const addedNFTs = useNFTTokens()
  const nfts = Object.values(addedNFTs)

  const title = (
    <div className={styles.title}>
      <span>CW721 Tokens</span>
      <button onClick={() => modal.open(<ManageCW721Token />)}>
        <Icon name="settings" />
      </button>
    </div>
  )

  const nftList = (
    <Card className={styles.nftList}>
      {title}
      {nfts.map((nft, key) => (
        <NFTItemList nft={nft} key={key} />
      ))}
      <button
        className={classnames('btn-more', styles.addButton)}
        onClick={() => modal.open(<AddCW721Token />)}
      >
        Add tokens
      </button>
    </Card>
  )

  return <>{isEmpty(nfts) ? <NFTPlaceholder /> : nftList}</>
}

export default NFTDetails
