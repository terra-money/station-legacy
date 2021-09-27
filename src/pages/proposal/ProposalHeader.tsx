import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import xss from 'xss'
import { Proposal } from '@terra-money/terra.js'
import { CoinItem, format } from '../../lib'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Displays from '../../components/Displays'
import { useProposalStatus } from '../../data/lcd/gov'
import { useProposer } from '../../data/lcd/gov'
import AccountLink from './AccountLink'
import s from './ProposalHeader.module.scss'

const ProposerHeader = ({ proposal }: { proposal: Proposal }) => {
  const { t } = useTranslation()
  const { id, content, submit_time } = proposal
  const { title, description } = content
  const badge = useProposalStatus(proposal)
  const proposer = useProposer(proposal.id)

  /* details */
  const { type, value } = content.toData()
  const contents = Object.entries(value)
    .filter(([key]) => !['title', 'description'].includes(key))
    .map(([key, content]) => ({
      title: capitalize(t('Page:Governance:' + key)),
      content:
        key === 'amount' ? (
          <Displays
            list={content.map((coin: CoinItem) => format.display(coin))}
          />
        ) : (
          stringify(content)
        ),
    }))

  const details = [
    { title: `${t('Page:Governance:Proposal')} ID`, content: id },
    { title: t('Common:Type'), content: type },
    ...contents,
    {
      title: t('Page:Governance:Submit time'),
      content: format.date(submit_time),
    },
  ]

  return (
    <div className="row">
      <div className="col col-8">
        <Card>
          {badge && (
            <Badge className={c('text-capitalize', badge.color)}>
              {badge.label}
            </Badge>
          )}

          <h1 className={s.title}>{title}</h1>
          <p className={s.meta}>
            {proposer && (
              <>
                Submitted by{' '}
                <strong>
                  <AccountLink address={proposer} />
                </strong>
              </>
            )}
          </p>

          <p
            className={s.description}
            dangerouslySetInnerHTML={{ __html: linkify(description) }}
          />
        </Card>
      </div>

      <div className="col col-4">
        <Card>
          <dl className={s.dl}>
            {details.map(({ title, content }) => (
              <Fragment key={title}>
                <dt>{title}</dt>
                <dd>{content}</dd>
              </Fragment>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default ProposerHeader

/* helpers */
const linkify = (text: string) =>
  xss(
    text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    )
  )

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const stringify = (value: string | object) =>
  typeof value !== 'string' ? JSON.stringify(value, null, 2) : value
