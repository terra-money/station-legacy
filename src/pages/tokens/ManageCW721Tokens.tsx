import ModalContent from '../../components/ModalContent'
import { useNFTTokens } from '../../data/nftTokens'
import NFTTokens from './NFTTokens'

const ManageCW721Token = () => {
  const tokens = useNFTTokens()
  return (
    <ModalContent>
      <h1 className="modal-title">Added NFT tokens</h1>
      <NFTTokens contracts={Object.values(tokens)} />
    </ModalContent>
  )
}

export default ManageCW721Token
