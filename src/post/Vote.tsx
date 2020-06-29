import React from 'react'
import { useVote, useAuth, Field } from '@terra-money/use-station'
import VoteItem from './VoteItem'
import Post from './Post'
import s from './Vote.module.scss'

const Vote = ({ params }: { params: { id: string; title: string } }) => {
  const { user } = useAuth()
  const response = useVote(user!, params)

  const formProps = {
    className: s.options,
    renderField: (field: Field<{ color: string }>) => <VoteItem {...field} />,
  }

  return <Post post={response} formProps={formProps} />
}

export default Vote
