import { NFTAvailableItem } from '../../lib'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import Send from '../../post/Send'
import AmountCard from './AmountCard'

interface Props extends NFTAvailableItem {
  buttonLabel: string
}

const NFTAvailable = (item: Props) => {
  const { denom, token, buttonLabel } = item
  const { modal } = useApp()

  const buttonAttrs = {
    onClick: () => modal.open(<Send denom={denom || token || ''} />),
    children: buttonLabel,
  }

  const renderButtons = () => {
    return (
      <>
        _link_to_marketplace_
        <ButtonWithAuth {...buttonAttrs} className="btn btn-primary btn-sm" />
      </>
    )
  }
  let nfts
  if (item.display.owned) {
    nfts = item.display.owned.map((nft) => {
      //  console.log('nft item',item);
      if (nft.img_url) {
        let img = nft.img_url
        if (img.startsWith('ipfs://')) {
          img = img.replace('ipfs://', 'https://ipfs.io/ipfs/')
        }
        return (
          <span key={nft.token_id}>
            <img alt="nft logo" src={img} height="60" />
            {nft.token_id}
            <br />
          </span>
        )
      } else {
        return <span key={nft.token_id}>{nft.token_id}</span>
      }
    })
  }

  return (
    <AmountCard
      {...item}
      button={renderButtons()}
      buttonAttrs={buttonAttrs}
      extended={denom === 'uusd'}
    >
      {nfts}
    </AmountCard>
  )
}

export default NFTAvailable
