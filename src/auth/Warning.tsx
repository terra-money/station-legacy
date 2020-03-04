import React, { InputHTMLAttributes } from 'react'
import { Trans, SignUpWarning } from '@terra-money/use-station'
import Pop from '../components/Pop'
import Flex from '../components/Flex'
import Icon from '../components/Icon'

interface Props extends SignUpWarning {
  attrs: InputHTMLAttributes<HTMLInputElement>
}

const Warning = ({ tooltip, i18nKey, attrs }: Props) => (
  <>
    <Pop type="tooltip" placement="top" content={tooltip[1]} fullWidth>
      {({ ref, iconRef, getAttrs }) => (
        <Flex
          {...getAttrs({ className: 'form-text text-danger' })}
          forwardRef={ref}
        >
          <Icon name="error" />
          <strong ref={iconRef}>{tooltip[0]}</strong>
        </Flex>
      )}
    </Pop>

    <section className="form-group form-check">
      <input type="checkbox" id="written" {...attrs} />
      <label htmlFor="written">
        <Trans i18nKey={i18nKey}>
          <strong />
        </Trans>
      </label>
    </section>
  </>
)

export default Warning
