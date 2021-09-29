import { useDelegate } from '../lib'
import { DelegateType } from './hooks/staking/useDelegate'
import Post from './Post'

interface Props {
  address: string
  type: DelegateType
}

const Delegate = ({ address: validatorAddress, type }: Props) => {
  const response = useDelegate({ validatorAddress, type })
  return <Post post={response} />
}

export default Delegate
