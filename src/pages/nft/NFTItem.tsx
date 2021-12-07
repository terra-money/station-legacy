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
  tokenId: string
}

const NFTItem = (item: Props) => {
  const { contract, tokenId } = item
  const { modal } = useApp()
  const { data } = useNFTQuery(contract, tokenId)

  const checkLunaPunkImage = (imageData: string | undefined) => {
    const LUNAPUNKS_CONTRACT = 'terra1qfy2nfr0zh70jyr3h4ns9rzqx4fl8rxpf09ytv'
    if (contract !== LUNAPUNKS_CONTRACT || !imageData) return
    const svgSplitString = imageData.split('viewBox')
    const svg = svgSplitString[0].concat(
      "xmlns='http://www.w3.org/2000/svg' viewBox",
      svgSplitString[1]
    )
    return 'data:image/svg+xml,'.concat(svg)
  }

  const render = () => {
    if (!data) return null

    const { extension } = data
    const { name, image, image_data } = extension

    const imgUrl = image?.startsWith('ipfs://')
      ? image?.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : image ?? checkLunaPunkImage(image_data)

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
    const sendButtonAttrs = {
      onClick: () => modal.open(<Send contract={contract} tokenId={tokenId} />),
      children: 'Send',
    }

    return (
      <article className={styles.wrapper}>
        <div className={styles.info}>
          {icon}
          <span className={styles.name}>{name || tokenId}</span>
        </div>
        <div className={styles.buttons}>
          <ButtonWithAuth
            {...viewButtonAttrs}
            disabled={!extension}
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
