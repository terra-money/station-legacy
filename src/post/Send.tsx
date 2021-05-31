import React from 'react'
import c from 'classnames'
import { RecentSentUI, RecentSentItemUI } from '../use-station/src'
import { useSend, useAuth } from '../use-station/src'
import ButtonGroup from '../components/ButtonGroup'
import Post from './Post'
import s from './Send.module.scss'
import useTokenBalance from '../use-station/src/cw20/useTokenBalance'

const Send = ({ denom }: { denom: string }) => {
  const { user } = useAuth()
  const tokenBalance = useTokenBalance(user!.address)
  const response = useSend(user!, denom, tokenBalance)

  const renderRecent = ({ title, contents }: RecentSentUI) => {
    const buttons = contents.map((content) => ({
      onClick: content.onClick,
      children: <RecentItem {...content} />,
    }))

    return (
      <section className={c('form-group', s.recent)}>
        <label className="label">{title}</label>
        <ButtonGroup buttons={buttons} column />
      </section>
    )
  }

  const formProps = { children: response.ui && renderRecent(response.ui) }

  return <Post post={response} formProps={formProps} />
}

export default Send

/* helper */
const RecentItem = ({ title, contents }: RecentSentItemUI) => (
  <article className={s.item}>
    <h1>{title}</h1>
    <ul className={s.contents}>
      {contents.map(({ title, content }) => (
        <li key={title}>
          <strong>{title}</strong>
          <span>{content}</span>
        </li>
      ))}
    </ul>
  </article>
)
