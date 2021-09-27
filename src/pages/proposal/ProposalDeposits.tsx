import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { format, gte, percent } from '../../lib'
import {
  useDeposits,
  useProposal,
  useProposalId,
  useQueryDepositParams,
} from '../../data/lcd/gov'
import Card from '../../components/Card'
import Orb from '../../components/Orb'
import Number from '../../components/Number'
import s from './ProposalDeposit.module.scss'

const ProposalDeposit = () => {
  const { t } = useTranslation()
  const id = useProposalId()
  const depositsContents = useDepositsContents(id)

  if (!depositsContents) return null

  const { ratio, completed, contents } = depositsContents

  return (
    <Card
      title={t('Page:Governance:Deposit')}
      mainClassName={s.main}
      bodyClassName={s.body}
      bordered
    >
      <section className={s.content}>
        <Orb ratio={ratio} completed={completed} size={120} className={s.orb} />
        <strong>{percent(ratio)}</strong>
        <p>
          {contents.total.title} {contents.total.content}
        </p>
      </section>

      <footer className={s.footer}>
        {[contents.minimum, contents.end].map(({ title, content }) => (
          <article key={title}>
            <h1>{title}</h1>
            {content}
          </article>
        ))}
      </footer>
    </Card>
  )
}

export default ProposalDeposit

/* hooks */
export const useDepositsContents = (id: number) => {
  const { t } = useTranslation()

  const { data: proposal } = useProposal(id)
  const { data: deposits } = useDeposits(id)
  const { data: depositParams } = useQueryDepositParams()

  if (!(proposal && deposits && depositParams)) return null

  const { min_deposit } = depositParams
  const amountMinimum = min_deposit.get('uluna')?.amount.toString() ?? '0'

  const amountTotal = deposits.reduce(
    (acc, { amount }) =>
      new BigNumber(acc)
        .plus(amount.get('uluna')?.amount.toString() ?? 0)
        .toString(),
    '0'
  )

  const ratio = new BigNumber(amountTotal).div(amountMinimum).toString()

  const contents = {
    total: {
      title: t('Page:Governance:Total'),
      content: (
        <Number
          {...format.display({ amount: amountTotal, denom: 'uluna' })}
          integer
        />
      ),
    },
    minimum: {
      title: t('Page:Governance:Minimum deposit'),
      content: (
        <Number
          {...format.display({ amount: amountMinimum, denom: 'uluna' })}
          integer
        />
      ),
    },
    ratio: {
      title: 'Deposit',
      content: percent(ratio),
    },
    end: {
      title: t('Page:Governance:Deposit end time'),
      content: format.date(proposal.deposit_end_time),
    },
  }

  const completed = gte(ratio, 1)
    ? t('Page:Governance:Min deposit completed')
    : undefined

  return { amountTotal, ratio, contents, completed }
}
