import { ReactNode } from 'react'
import c from 'classnames'
import { last } from 'ramda'
import { useSwap, useInfo, Field } from '../lib'
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
import ButtonWithAuth from '../components/ButtonWithAuth'
import SwapMultiple from './SwapMultiple'
import Confirmation from './Confirmation'
import SlippageTolerance from './SlippageTolerance'
import s from './Swap.module.scss'

interface ComponentProps extends Props {
  title: string
  user: User
}

const Component = ({ actives, user, title }: ComponentProps) => {
  const { modal } = useApp()
  const { ERROR } = useInfo()
  const { error, load, loading, form, confirm, ui } = useSwap(user, actives)
  const { bank, pairs, expectedPrice, message, max, spread } = ui!
  const { label, slippageField } = ui!

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
    confirm &&
      modal.open(
        <Confirmation confirm={confirm} modal={modal} onFinish={load} />
      )
  }

  const renderRadio = ({ attrs, options, setValue }: Field) => {
    return (
      !attrs.hidden &&
      options!.map(({ value, children }) => (
        <button
          className={c('badge', value === attrs.value && 'badge-primary')}
          onClick={() => setValue!(value)}
          key={value}
        >
          {children}
        </button>
      ))
    )
  }

  const renderTitle = () => (
    <div className={s.title}>
      {title}
      <Pop
        type="pop"
        placement="bottom"
        width={340}
        content={
          <SlippageTolerance
            value={slippageField.attrs.value!}
            setValue={slippageField.setValue!}
            error={slippageField.error}
          />
        }
      >
        {({ ref, iconRef, getAttrs }) => (
          <span {...getAttrs({ className: s.button })} ref={ref}>
            <Icon name="settings" />
          </span>
        )}
      </Pop>
    </div>
  )

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <Loading />
  ) : form ? (
    <Card
      title={renderTitle()}
      actions={renderRadio(last(form.fields)!)}
      bordered
    >
      <FormSwap
        form={{ ...form, onSubmit }}
        message={message}
        contents={contents}
      />

      <hr />

      {bank && pairs && (
        <ButtonWithAuth
          className={s.all}
          onClick={() =>
            modal.open(
              <SwapMultiple bank={bank} pairs={pairs} onFinish={load} />
            )
          }
        >
          <Icon name="bolt" size={24} className={s.icon} />
          {label.multipleSwap}
        </ButtonWithAuth>
      )}
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
