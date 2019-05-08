import React from 'react'
import Copy from '../../components/Copy'
import s from './Address.module.scss'

const Address = ({ address }: { address: string }) => (
  <Copy
    text={address}
    classNames={{ container: s.copy, text: s.text, button: s.button }}
  >
    {address}
  </Copy>
)

export default Address
