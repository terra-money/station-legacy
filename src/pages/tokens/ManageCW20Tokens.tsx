import { useTokens } from '../../data/tokens'
import ModalContent from '../../components/ModalContent'
import Tokens from './Tokens'

const ManageCW20Token = () => {
  const tokens = useTokens()
  return (
    <ModalContent>
      <h1 className="modal-title">Added tokens</h1>
      <Tokens tokens={Object.values(tokens)} />
    </ModalContent>
  )
}

export default ManageCW20Token
