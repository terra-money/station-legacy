import React from 'react'
import { GovernanceParamUI } from '@terra-money/use-station'
import Displays from '../../components/Displays'

const Footer = ({ list }: { list: GovernanceParamUI[] }) => (
  <>
    {list.map(({ title, content, displays }) => (
      <article key={title}>
        <h1>{title}</h1>
        <section>
          {content ?? (displays && <Displays list={displays} />)}
        </section>
      </article>
    ))}
  </>
)

export default Footer
