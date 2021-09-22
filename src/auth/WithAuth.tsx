import { ReactNode } from 'react'
import { useUser } from '../data/auth'
import PleaseSignIn from '../components/PleaseSignIn'

interface Props {
  card?: boolean
  children: (user: User) => ReactNode
}

const WithAuth = ({ card, children }: Props) => {
  const user = useUser()
  return !user ? <PleaseSignIn card={card} /> : <>{children(user)}</>
}

export default WithAuth
