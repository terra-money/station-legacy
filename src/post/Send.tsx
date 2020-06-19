import React from 'react'
import c from 'classnames'
import { RecentSentUI, RecentSentItemUI } from '@terra-money/use-station'
import { useSend, useAuth, useInfo } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import ButtonGroup from '../components/ButtonGroup'
import Confirmation from './Confirmation'
import s from './Send.module.scss'

const Send = ({ denom }: { denom: string }) => {
  const { modal } = useApp()
  const { user } = useAuth()
  const { ERROR } = useInfo()
  const { error, loading, submitted, form, confirm, ui } = useSend(user!, denom)

  const renderRecent = ({ title, contents }: RecentSentUI) => {
    const buttons = contents.map((content) => ({
      onClick: content.onClick,
      children: <RecentItem {...content} />,
    }))

    return (
      <section className={c('form-group', s.recent)}>
        <label className="label">{title}</label>
        <ButtonGroup buttons={buttons} />
      </section>
    )
  }

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <ProgressCircle center />
  ) : !submitted ? (
    <ModalContent close={modal.close}>
      {form && <Form form={form}>{ui && renderRecent(ui)}</Form>}
    </ModalContent>
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} />
  ) : null
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
