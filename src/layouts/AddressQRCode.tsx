import QRCode from '../auth/QRCode'
import { useAuth } from '../lib'

const AddressQRCode = () => {
  const { user } = useAuth()
  const { address } = user!
  return <QRCode title="Your wallet address" data={address} warn={address} />
}

export default AddressQRCode
