import { usePropose } from '../lib'
import Post from './Post'

const Propose = () => {
  const response = usePropose()
  return <Post post={response} />
}

export default Propose
