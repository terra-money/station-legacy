import { useUpload } from '../lib'
import Post from './Post'

const Upload = () => {
  const response = useUpload()
  return <Post post={response} />
}

export default Upload
