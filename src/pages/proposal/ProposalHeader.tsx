import React, { Fragment } from 'react'
import c from 'classnames'
import xss from 'xss'
import { ProposalUI } from '../../lib'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { getBadgeColor } from '../governance/helpers'
import Voter from './Voter'
import s from './ProposalHeader.module.scss'

const ProposerHeader = ({ title, status, ...rest }: ProposalUI) => {
  const { statusTranslation, meta, proposer, description, details } = rest

  return (
    <div className="row">
      <div className="col col-8">
        <Card>
          <Badge className={c('text-capitalize', getBadgeColor(status))}>
            {statusTranslation}
          </Badge>

          <h1 className={s.title}>{title}</h1>
          <p className={s.meta}>
            {meta}
            <strong>
              <Voter voter={proposer} />
            </strong>
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
