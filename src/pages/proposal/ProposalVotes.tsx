import { TFunction, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { div, format, gt, lt, percent, sum, times, VoteOption } from '../../lib'
import { useProposal, useProposalId } from '../../data/lcd/gov'
import { useVotesContents, useTallyParams } from '../../data/lcd/gov'
import { useStakingPool } from '../../data/lcd/staking'
import Card from '../../components/Card'
import Number from '../../components/Number'
import VoteChart from '../governance/VoteChart'
import VoteProgress from './VoteProgress'
import s from './ProposalVotes.module.scss'

const ProposalVotes = () => {
  const { t } = useTranslation()
  const id = useProposalId()
  const { data: tallyParams } = useTallyParams()
  const { data: proposal } = useProposal(id)
  const { data: pool } = useStakingPool()
  const votesContens = useVotesContents(id)

  if (!(proposal && pool && tallyParams && votesContens)) return null

  const { voting_end_time } = proposal

  const { total, list } = votesContens
  const stakedLuna = pool.bonded_tokens.amount.toString()
  const ratio = new BigNumber(total).div(stakedLuna).toString()

  const progress = getProgress({
    t,
    list,
    ratio,
    threshold: tallyParams.threshold.toString(),
    quorum: tallyParams.quorum.toString(),
  })

  return (
    <Card title={t('Page:Governance:Vote')} bordered>
      <section className={s.main}>
        <header className={s.header}>
          <VoteChart options={list} />

          <section className={s.summary}>
            <article>
              <h1>{t('Page:Governance:Total')}</h1>
              <Number
                {...format.display({ amount: total, denom: 'uluna' })}
                fontSize={18}
              />
            </article>
            <article>
              <h1>{t('Page:Governance:Voting end time')}</h1>
              <p>{format.date(voting_end_time)}</p>
            </article>
          </section>
        </header>

        <section className={s.options}>
          {list.map(({ voted, label, ratio, color }) => (
            <div className={s.option} key={label}>
              <article style={{ borderColor: color }}>
                <h1>{label}</h1>
                <p>{percent(ratio)}</p>
                <Number fontSize={14}>{format.amount(voted)}</Number>
              </article>
            </div>
          ))}
        </section>
      </section>

      <footer className={s.footer}>
        <VoteProgress {...progress} />
        <p>
          <strong>
            {t('Page:Governance:Percent voting')}: {percent(ratio)}
          </strong>
        </p>
        <small>
          {t('Page:Governance:{{n}} of {{d}} has voted', {
            n: format0a(total),
            d: format0a(stakedLuna),
          })}
        </small>
      </footer>
    </Card>
  )
}

export default ProposalVotes

/* helpers */
const format0a = (s: string) =>
  numeral(format.amountN(s)).format('0a').toUpperCase()

interface Params {
  list: VoteOption[]
  ratio: string
  threshold: string
  quorum: string
  t: TFunction
}

const getProgress = ({ list, ratio, threshold, quorum, t }: Params) => {
  const getRatio = ({ ratio }: VoteOption) => ratio
  const d = sum(list.slice(0, 3).map(getRatio))
  const showQuorum = quorum && lt(ratio, quorum)
  const showThreshold = gt(d, 0) && !!threshold
  const showFlag = showQuorum || showThreshold

  const left = showQuorum
    ? percent(quorum!)
    : percent(times(times(ratio, d), threshold!))

  const text = showQuorum
    ? t('Page:Governance:Quorum')
    : t('Page:Governance:Pass threshold')

  return {
    flag: showFlag ? { percent: left, text } : undefined,
    list: list.map((item) => ({
      percent: percent(times(ratio, item.ratio)),
      color: item.color,
    })),
  }
}
