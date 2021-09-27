import { useTranslation } from 'react-i18next'
import { percent } from '../../lib'
import { useTallyParams } from '../../data/lcd/gov'
import Card from '../../components/Card'
import s from './ProposalFooter.module.scss'

const ProposalFooter = () => {
  const { t } = useTranslation()
  const { data } = useTallyParams()

  if (!data) return null
  const { quorum, threshold, veto_threshold } = data
  const title = t('Page:Governance:Tallying procedure')

  const contents = [
    {
      title: t('Page:Governance:Quorum'),
      content: percent(quorum.toString()),
    },
    {
      title: t('Page:Governance:Pass threshold'),
      content: percent(threshold.toString()),
    },
    {
      title: t('Page:Governance:Veto threshold'),
      content: percent(veto_threshold.toString()),
    },
  ]

  return (
    <Card title={title} bodyClassName={s.tallying} bordered>
      {contents.map(({ title, content }) => (
        <article key={title}>
          <h1>{title}</h1>
          <p>{content}</p>
        </article>
      ))}
    </Card>
  )
}

export default ProposalFooter
