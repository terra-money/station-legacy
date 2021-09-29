import useFinder from '../../hooks/useFinder'
import ExtLink from '../../components/ExtLink'

const AccountLink = ({ address }: { address: string }) => {
  const getLink = useFinder()

  return (
    <ExtLink href={getLink({ q: 'account', v: address })}>{address}</ExtLink>
  )
}

export default AccountLink
