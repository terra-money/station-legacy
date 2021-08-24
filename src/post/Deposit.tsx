import React, { Fragment } from 'react'
import c from 'classnames'
import { useDeposit, useAuth } from '../lib'
import { DepositContent } from '../lib'
import Displays from '../components/Displays'
import Post from './Post'
import s from './Deposit.module.scss'

interface Props {
  params: { id: string; title: string }
  contents: DepositContent[]
}

const Deposit = ({ params, contents }: Props) => {
  const { user } = useAuth()
  const response = useDeposit(user!, params)

  const formProps = {
    renderBeforeFields: () => (
      <dl className={c('dl-wrap', s.dl)}>
        {contents.map(({ title, displays, content }) => (
          <Fragment key={title}>
            <dt>{title}</dt>
            <dd>{displays ? <Displays list={displays} /> : content}</dd>
          </Fragment>
        ))}
      </dl>
    ),
  }

  return <Post post={response} formProps={formProps} />
}

export default Deposit
