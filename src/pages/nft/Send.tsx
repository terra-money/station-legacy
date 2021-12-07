import useTransferNFT from '../../post/hooks/nft/useTransferNFT'
import Post from '../../post/Post'

const Send = ({ contract, tokenId }: { contract: string; tokenId: string }) => {
  const response = useTransferNFT(contract, tokenId)
  return <Post post={response} />
}

export default Send
