import React, { ReactNode } from 'react'
import { useSwap, useInfo, User } from '../use-station/src'
import { useApp } from '../hooks'
import WithAuth from '../auth/WithAuth'
import Confirm from '../components/Confirm'
import Loading from '../components/Loading'
import FormSwap from '../components/FormSwap'
import Card from '../components/Card'
import Number from '../components/Number'
import Flex from '../components/Flex'
import Icon from '../components/Icon'
import Pop from '../components/Pop'
import Confirmation from './Confirmation'
import s from './Swap.module.scss'

interface ComponentProps extends Props {
  title: string
  user: User
}

const Component = ({ actives, user, title }: ComponentProps) => {
  const { modal } = useApp()
  const { ERROR } = useInfo()
  const { error, loading, form, confirm, ui } = useSwap(user, actives)
  const { mode, expectedPrice, message, max, spread } = ui!

  /* render */
  const pop = (
    <Pop type="tooltip" placement="top" width={340} content={spread?.tooltip}>
      {({ ref, getAttrs }) => (
        <Icon
          name="info"
          forwardRef={ref}
          {...getAttrs({ className: s.icon })}
        />
      )}
    </Pop>
  )

  const spreadTitle = (
    <Flex>
      {spread?.title}
      {spread?.tooltip && pop}
    </Flex>
  )

  const contents: ReactNode[] = [
    <Table
      rows={
        max
          ? [{ heading: max.title, ...max.display, onClick: max.attrs.onClick }]
          : []
      }
    />,
    <Table
      rows={([] as RowItem[])
        .concat(
          expectedPrice
            ? { heading: expectedPrice.title, content: expectedPrice.text }
            : []
        )
        .concat(spread ? { heading: spreadTitle, ...spread } : [])}
    />,
  ]

  const onSubmit = () => {
    form?.onSubmit?.()
    confirm && modal.open(<Confirmation confirm={confirm} modal={modal} />)
  }

  const renderMode = () => <span className="badge">{mode}</span>

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <Loading />
  ) : form ? (
    <Card title={title} actions={renderMode()} bordered>
      <FormSwap
        form={{ ...form, onSubmit }}
        message={message}
        contents={contents}
      />
    </Card>
  ) : null
}

interface Props {
  title: string
  actives: string[]
}

const Swap = (props: Props) => (
  <WithAuth>{(user) => <Component {...props} user={user} />}</WithAuth>
)

export default Swap

/* helpers */
interface RowItem {
  heading: ReactNode
  text?: string
  value?: string
  unit?: string
  content?: string
  onClick?: () => void
}

const Table = ({ rows }: { rows: RowItem[] }) => (
  <table className={s.table}>
    <tbody>
      {rows.map(({ heading, text, value, unit, content, onClick }, index) => {
        const number = text ?? <Number unit={unit}>{value}</Number>
        const button = (
          <button type="button" className="text-underline" onClick={onClick}>
            {number}
          </button>
        )

        return (
          <Row
            th={heading}
            td={content ?? (onClick ? button : number)}
            key={index}
          />
        )
      })}
    </tbody>
  </table>
)

const Row = ({ th, td }: { th: ReactNode; td: ReactNode }) => (
  <tr>
    <th>{th}</th>
    <td className="text-right">{td}</td>
  </tr>
)
