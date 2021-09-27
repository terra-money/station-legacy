import { Fragment } from 'react'
import c from 'classnames'
import { useDeposit } from '../lib'
import { useDepositsContents } from '../pages/proposal/ProposalDeposits'
import Post from './Post'
import s from './Deposit.module.scss'

interface Props {
  params: { id: number; title: string }
}

const Deposit = ({ params }: Props) => {
  const response = useDeposit(params)
  const despoitsContents = useDepositsContents(params.id)

  if (!despoitsContents) return null

  const { contents } = despoitsContents

  const formProps = {
    renderBeforeFields: () => (
      <dl className={c('dl-wrap', s.dl)}>
        {Object.values(contents).map(({ title, content }) => (
          <Fragment key={title}>
            <dt>{title}</dt>
            <dd>{content}</dd>
          </Fragment>
        ))}
      </dl>
    ),
  }

  return <Post post={response} formProps={formProps} />
}

export default Deposit
