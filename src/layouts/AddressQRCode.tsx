import QRCode from '../auth/QRCode'
import { useAddress } from '../data/auth'

const AddressQRCode = () => {
  const address = useAddress()
  return <QRCode title="Your wallet address" data={address} info={address} />
}

export default AddressQRCode
