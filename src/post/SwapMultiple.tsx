import { useSwapMultiple } from '../lib'
import { BankData, Pairs, Field as FieldProps } from '../lib'
import Field from '../components/Field'
import Icon from '../components/Icon'
import Post from './Post'
import CoinFields from './CoinFields'
import s from './SwapMultiple.module.scss'

interface Props {
  bank: BankData
  pairs: Pairs
  onFinish?: () => Promise<void>
}

const SwapMultiple = ({ bank, pairs, onFinish }: Props) => {
  const response = useSwapMultiple({ bank, pairs })
  const { ui } = response

  const renderAfterFields = () => (
    <>
      <label className="label">{ui.checkboxes.label}</label>

      <section className={s.list}>
        {ui.checkboxes.list.map((field: FieldProps) => {
          const { attrs, ui } = field
          const { id } = attrs
          const { available, simulated } = ui

          return (
            <div className={s.item} key={id}>
              <div className={s.inner}>
                <section className={s.field}>
                  <Field
                    className={{ checkbox: s.checkbox }}
                    field={field}
                    key={id}
                  />
                </section>

                <footer className={s.footer}>
                  <p>{available}</p>

                  {simulated && (
                    <p className={s.simulated}>
                      <Icon name="arrow_forward" size={10} />
                      {simulated}
                    </p>
                  )}
                </footer>
              </div>
            </div>
          )
        })}
      </section>

      <CoinFields {...ui.group} />
    </>
  )

  return (
    <Post
      post={response}
      formProps={{ renderAfterFields }}
      onFinish={onFinish}
    />
  )
}

export default SwapMultiple
