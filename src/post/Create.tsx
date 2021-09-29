import { useCreate } from '../lib'
import CoinFields from './CoinFields'
import Post from './Post'
import WithActiveDenoms from './WithActiveDenoms'

const Component = ({ denoms }: { denoms: string[] }) => {
  const response = useCreate(denoms)
  const { ui } = response
  return (
    <Post
      post={response}
      formProps={{ renderAfterFields: () => <CoinFields {...ui!} /> }}
    />
  )
}

const Create = () => (
  <WithActiveDenoms>
    {(denoms) => <Component denoms={['uluna', ...denoms]} />}
  </WithActiveDenoms>
)

export default Create
