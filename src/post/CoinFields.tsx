import c from 'classnames'
import { CoinFields as Props } from '../lib'
import Field from '../components/Field'
import Flex from '../components/Flex'
import s from './CoinFields.module.scss'

const CoinFields = ({ label, groups }: Props) => (
  <div className="form-group">
    <label className="label">{label}</label>

    {groups.map(({ denom, input, button }, index) => {
      return (
        <Flex className={s.row} key={index}>
          <div className={c('input-group', s.input)}>
            <Field field={denom} className={{ select: s.prepend }} />
            <Field field={input} />
          </div>

          {button && (
            <button
              {...button}
              type="button"
              className={c('form-control', s.button)}
            />
          )}
        </Flex>
      )
    })}
  </div>
)

export default CoinFields
