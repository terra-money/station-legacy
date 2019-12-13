import React, { Fragment, ReactNode } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import c from 'classnames'
import { percent } from '../../api/math'
import { format } from '../../utils'
import { useGoBack } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Finder from '../../components/Finder'
import WithRequest from '../../components/WithRequest'
import { getBadgeColor } from '../governance/helpers'
import Actions from './Actions'
import Deposit from './Deposit'
import Deposits from './Deposits'
import Vote from './Vote'
import VoteTable from './VoteTable'
import Tallying from './Tallying'
import s from './Proposal.module.scss'

const Component = (props: ProposalDetail) => {
  useGoBack('/governance')

  const { id, submitTime, status, title, proposer, type, description } = props
  const { content, vote, deposit, tallyingParameters } = props

  /* render: metadata */
  type Metadata = [string, ReactNode]
  const parseContent = ({ key, value }: Content): Metadata => {
    const stringify = (v: any) =>
      typeof v !== 'string' ? (
        <pre>{JSON.stringify(v, null, 2)}</pre>
      ) : key === 'tax_rate' ? (
        percent(v)
      ) : (
        v
      )

    return [key, stringify(value)]
  }

  const metadata: Metadata[] = [
    ['Proposal ID', id],
    ['Type', type],
    ...content.map(parseContent),
    ['Submit time', format.date(submitTime)]
  ]

  const renderMetadata = ([title, content]: Metadata) => (
    <Fragment key={title}>
      <dt>{title}</dt>
      <dd>{content}</dd>
    </Fragment>
  )

  return (
    <Page title="Proposal Detail" action={<Actions detail={props} />}>
      <div className="row">
        <div className="col col-8">
          <Card>
            <Badge className={c('text-capitalize', getBadgeColor(status))}>
              {status}
            </Badge>

            <h1 className={s.title}>{title}</h1>
            <p className={s.meta}>
              Submitted by{' '}
              <strong>
                <Finder q="account" v={proposer}>
                  {proposer}
                </Finder>
              </strong>
            </p>

            <p className={s.description}>{description}</p>
          </Card>
        </div>
        <div className="col col-4">
          <Card>
            <dl className={s.dl}>{metadata.map(renderMetadata)}</dl>
          </Card>
        </div>
      </div>

      {status !== 'Deposit' && vote && (
        <>
          <Card title="Vote" bordered>
            <Vote
              vote={vote}
              showProgressBar={status === 'Voting'}
              threshold={tallyingParameters?.threshold}
            />
          </Card>

          <VoteTable {...vote} />
        </>
      )}

      <div className="row">
        <div className="col col-4">
          <Deposit {...deposit} />
        </div>
        <div className="col col-8">
          <Deposits id={id} />
        </div>
      </div>

      {status === 'Voting' && tallyingParameters && (
        <Card title="Tallying Procedure" bordered bodyClassName={s.tallying}>
          <Tallying {...tallyingParameters} />
        </Card>
      )}
    </Page>
  )
}

const Proposal = ({ match }: RouteComponentProps<{ id: string }>) => (
  <WithRequest url={`/v1/gov/proposals/${match.params.id}`}>
    {(data: ProposalDetail) => <Component {...data} />}
  </WithRequest>
)

export default Proposal
