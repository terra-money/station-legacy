import { WithdrawProps } from '../lib'
import { useWithdraw } from '../lib'
import Post from './Post'

const Withdraw = (props: WithdrawProps) => {
  const response = useWithdraw(props)
  return <Post post={response} />
}

export default Withdraw
