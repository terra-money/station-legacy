import React from 'react'
import { useConfirmSeed, SignUpNext } from '@terra-money/use-station'
import Form, { State } from '../components/Form'
import ButtonGroup from '../components/ButtonGroup'
import s from './ConfirmSeed.module.scss'

const ConfirmSeed = (props: SignUpNext) => {
  const { form, hint } = useConfirmSeed(props)

  const renderButtonGroup = ({ index, setIndex }: State) => {
    const buttons = hint.map(({ label: children, onClick }) => ({
      children,
      onClick: () => {
        onClick(index)
        setIndex(index + 1)
      },
    }))

    return <ButtonGroup buttons={buttons} wrap />
  }

  return <Form form={form} className={s.form} render={renderButtonGroup} />
}

export default ConfirmSeed
