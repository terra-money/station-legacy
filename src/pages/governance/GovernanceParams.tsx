import { Duration } from 'luxon'
import { div, format, toNumber } from '../../lib'
import { toStationCoin } from '../../utils/format'
import Displays from '../../components/Displays'
import { useQueryDepositParams, useQueryVotingParams } from '../../data/lcd/gov'

const GovernanceParams = () => {
  const { data: votingParams } = useQueryVotingParams()
  const { data: depositParams } = useQueryDepositParams()

  if (!(votingParams && depositParams)) return null

  const list = [
    {
      title: 'Voting period',
      content: daysFromNanoseconds(votingParams.voting_period),
    },
    {
      title: 'Minimum deposit',
      content: (
        <Displays
          list={depositParams.min_deposit.map((coin) =>
            format.display(toStationCoin(coin))
          )}
        />
      ),
    },
    {
      title: 'Maximum deposit period',
      content: daysFromNanoseconds(depositParams.max_deposit_period),
    },
  ]

  return (
    <>
      {list.map(({ title, content }) => (
        <article key={title}>
          <h1>{title}</h1>
          <section>{content}</section>
        </article>
      ))}
    </>
  )
}

export default GovernanceParams

/* helpers */
const daysFromNanoseconds = (nanosecond: number) =>
  Duration.fromMillis(toNumber(div(nanosecond, 1e6))).toFormat('d') + ' days'
