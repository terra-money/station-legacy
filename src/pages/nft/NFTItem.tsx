import classNames from 'classnames'
import { useApp } from '../../hooks'
import { ReactComponent as Default } from '../../images/NFTDefault.svg'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import useNFTQuery from '../../cw721/useNFTQuery'
import { NFTContract } from '../../types'
import Send from './Send'
import View from './View'
import styles from './NFTItem.module.scss'

interface Props extends NFTContract {
  nftName: string
}

const NFTItem = (item: Props) => {
  const { contract, nftName } = item
  const { modal } = useApp()
  const { data } = useNFTQuery(contract, nftName)

  const render = () => {
    if (!data) return null

    const { extension } = data
    const { name, image } = extension

    const imgUrl = image?.startsWith('ipfs://')
      ? image?.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : image

    const icon = imgUrl ? (
      <img
        alt="nft logo"
        src={imgUrl}
        width="50"
        height="50"
        className={styles.image}
      />
    ) : (
      <Default width="50" height="50" className={styles.image} />
    )

    const viewButtonAttrs = {
      onClick: () => modal.open(<View info={extension} />),
      children: 'View',
    }
    const sendButtonAttrs = name && {
      onClick: () => modal.open(<Send contract={contract} tokenId={name} />),
      children: 'Send',
    }

    return (
      <article className={styles.wrapper}>
        <div className={styles.info}>
          {icon}
          <span>{name || 'NFT'}</span>
        </div>
        <div className={styles.buttons}>
          <ButtonWithAuth
            {...viewButtonAttrs}
            className={classNames(styles.viewButton, 'btn btn-sky btn-sm')}
          />
          <ButtonWithAuth
            {...sendButtonAttrs}
            className="btn btn-primary btn-sm"
          />
        </div>
      </article>
    )
  }

  return <>{render()}</>
}

export default NFTItem
