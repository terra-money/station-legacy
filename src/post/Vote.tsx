import { useVote, Field } from '../lib'
import VoteItem from './VoteItem'
import Post from './Post'
import s from './Vote.module.scss'

const Vote = ({ params }: { params: { id: number; title: string } }) => {
  const response = useVote(params)

  const formProps = {
    className: s.options,
    renderField: (field: Field<{ color: string }>) => <VoteItem {...field} />,
  }

  return <Post post={response} formProps={formProps} />
}

export default Vote
