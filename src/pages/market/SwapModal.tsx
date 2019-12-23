import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import ModalContent from '../../components/ModalContent'
import Confirmation from '../Confirmation'
import { Values } from './Swap'

type Props = {
  receive: string
  amount: string
  onSwapping: (b: boolean) => void
  close: () => void
}

const SwapModal = (props: Values & Props) => {
  const { receive, from, to, input, amount, onSwapping, close } = props

  const { t } = useTranslation()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)

  const handleSwapping = (b: boolean) => {
    setIsSwapping(b)
    onSwapping(b)
  }

  return (
    <ModalContent close={close} disabled={isSwapping}>
      <Confirmation
        url={'/market/swap'}
        denom={from}
        payload={{ ask_denom: to, offer_coin: { amount, denom: from } }}
        amount={amount}
        receive={{ amount: receive, denom: to }}
        warning={[
          t('Final amount you receive in '),
          format.denom(to),
          t(' may vary due to the swap rate changes.')
        ].join('')}
        label={['Swap', 'Swapping']}
        message={`Swapped ${input} ${[from, to]
          .map(format.denom)
          .join(' to ')}`}
        onSubmitting={handleSwapping}
        onFinish={close}
      />
    </ModalContent>
  )
}

export default SwapModal
