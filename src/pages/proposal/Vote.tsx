import React from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { percent, div } from '../../api/math'
import { format } from '../../utils'
import Amount from '../../components/Amount'
import { convertVote } from '../governance/helpers'
import VoteChart from '../governance/VoteChart'
import VoteProgress from './VoteProgress'
import s from './Vote.module.scss'

interface Props {
  vote: Vote
  showProgressBar: boolean
  threshold?: string
}

const Vote = ({ vote, showProgressBar, threshold }: Props) => {
  const { distribution, total, votingEndTime, stakedLuna } = vote

  const { t } = useTranslation()
  const { list } = convertVote(distribution)
  const ratio = div(total, stakedLuna)

  return (
    <>
      <section className={s.main}>
        <header className={s.header}>
          <VoteChart options={list} />

          <section className={s.summary}>
            <article>
              <h1>{t('Total')}</h1>
              <Amount fontSize={18} denom="uluna">
                {total}
              </Amount>
            </article>
            <article>
              <h1>{t('Voting end time')}</h1>
              <p>{format.date(votingEndTime)}</p>
            </article>
          </section>
        </header>

        <section className={s.options}>
          {list.map(({ label, ratio, amount }) => (
            <div className={s.option} key={label}>
              <article className={s[label]}>
                <h1>{t(label)}</h1>
                <p>{percent(ratio)}</p>
                <Amount fontSize={14}>{amount}</Amount>
              </article>
            </div>
          ))}
        </section>
      </section>

      {showProgressBar && (
        <footer className={s.footer}>
          <VoteProgress threshold={threshold} ratio={ratio} list={list} />
          <p>
            <strong>
              {t('Percent voting: ')}
              {percent(ratio)}
            </strong>
          </p>
          <small>
            {[total, stakedLuna].map(formatNumeral).join(' of ')} Luna
            {t(' has voted.')}
          </small>
        </footer>
      )}
    </>
  )
}

export default Vote

/* helper */
const formatNumeral = (s: string) =>
  numeral(div(s, 1e6))
    .format('0a')
    .toUpperCase()
