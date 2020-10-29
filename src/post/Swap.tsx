import React, { ReactNode } from 'react'
import { useSwap, useInfo, User } from '@terra-money/use-station'
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

const Component = ({ actives, user }: Props & { user: User }) => {
  const { modal } = useApp()
  const { ERROR } = useInfo()
  const { error, loading, form, confirm, ui } = useSwap(user, actives)
  const { message, max, spread, receive } = ui!

  /* render */
  const spreadTitle = (
    <Flex>
      {spread.title}
      <Pop type="tooltip" placement="top" width={340} content={spread.text}>
        {({ ref, getAttrs }) => (
          <Icon
            name="info"
            forwardRef={ref}
            {...getAttrs({ className: s.icon })}
          />
        )}
      </Pop>
    </Flex>
  )

  const contents: ReactNode[] = [
    <Table
      rows={[
        { heading: max.title, ...max.display, onClick: max.attrs.onClick },
      ]}
    />,
    <Table
      rows={[
        { heading: spreadTitle, ...spread },
        { heading: receive.title, ...receive },
      ]}
    />,
  ]

  const onSubmit = () => {
    form?.onSubmit?.()
    confirm && modal.open(<Confirmation confirm={confirm} modal={modal} />)
  }

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <Loading />
  ) : form ? (
    <FormSwap
      form={{ ...form, onSubmit }}
      message={message}
      contents={contents}
    />
  ) : null
}

interface Props {
  title: string
  actives: string[]
}

const Swap = (props: Props) => (
  <Card title={props.title} bordered>
    <WithAuth>{(user) => <Component {...props} user={user} />}</WithAuth>
  </Card>
)

export default Swap

/* helpers */
interface RowItem {
  heading: ReactNode
  value: string
  unit?: string
  onClick?: () => void
}

const Table = ({ rows }: { rows: RowItem[] }) => (
  <table className={s.table}>
    <tbody>
      {rows.map(({ heading, value, unit, onClick }, index) => {
        const number = <Number unit={unit}>{value}</Number>
        const button = (
          <button type="button" className="text-underline" onClick={onClick}>
            {number}
          </button>
        )

        return <Row th={heading} td={onClick ? button : number} key={index} />
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
