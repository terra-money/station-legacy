import React from 'react'
import { TallyingUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import s from './ProposalFooter.module.scss'

const ProposalFooter = ({ title, contents }: TallyingUI) => (
  <Card title={title} bodyClassName={s.tallying} bordered>
    {contents.map(({ title, content }) => (
      <article key={title}>
        <h1>{title}</h1>
        <p>{content}</p>
      </article>
    ))}
  </Card>
)

export default ProposalFooter
