import { FC } from 'react'
import useChains, { useInitChains } from './pages/settings/useMergeChains'

const WithChains: FC = ({ children }) => {
  useInitChains()
  const chains = useChains()

  return <>{!Object.keys(chains).length ? null : children}</>
}

export default WithChains
