import React from 'react'
import { useTranslation } from 'react-i18next'
import { percent } from '../../api/math'

const Tallying = ({ quorum, threshold, veto }: TallyingParameters) => {
  const { t } = useTranslation()

  const contents = [
    [t('Quorum'), quorum],
    [t('Pass threshold'), threshold],
    [t('Veto threshold'), veto]
  ]

  const renderContent = ([title, value]: string[]) => (
    <article key={title}>
      <h1>{title}</h1>
      <p>{percent(value)}</p>
    </article>
  )

  return <>{contents.map(renderContent)}</>
}

export default Tallying
