import React from 'react'
import { Card as Props } from '@terra-money/use-station'
import Card from '../../components/Card'
import Copy from '../../components/Copy'
import s from './Address.module.scss'

const Address = ({ title, content }: Props) =>
  !content ? null : (
    <Card title={title} bordered>
      <Copy
        text={content}
        classNames={{ container: s.copy, text: s.text, button: s.button }}
        noLabel
      >
        {content}
      </Copy>
    </Card>
  )

export default Address
