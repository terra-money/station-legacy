import { useNFTTokens } from '../../data/tokens'
import ModalContent from '../../components/ModalContent'

import NFTTokens from './NFTTokens'

const ManageNFTToken = () => {
  const tokens = useNFTTokens()
  return (
    <ModalContent>
      <h1 className="modal-title">Added NFT tokens</h1>
      <NFTTokens tokens={Object.values(tokens)} />
    </ModalContent>
  )
}

export default ManageNFTToken
