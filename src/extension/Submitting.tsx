import React from 'react'
import gif from './submitting.gif'
import s from './Submitting.module.scss'

const Submitting = () => (
  <div className={s.wrapper}>
    <img src={gif} width={160} height={160} alt="Submitting..." />
    <h1>Broadcasting Transaction</h1>
    <p>Please wait while your transaction is being processed.</p>
  </div>
)

export default Submitting
