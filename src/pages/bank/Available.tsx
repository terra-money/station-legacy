import React from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import { useAuth, useModal } from '../../hooks'
import Modal from '../../components/Modal'
import ButtonWithName from '../../components/ButtonWithName'
import AmountCard from './AmountCard'
import Send from './Send'

const Available = ({ denom, available }: Balance) => {
  const { t } = useTranslation()
  const { name, withLedger } = useAuth()
  const modal = useModal()

  const openModal = () =>
    modal.open(
      <Send
        initial={{ denom }}
        max={available}
        onSending={modal.prevent}
        onSend={modal.close}
      />
    )

  return (
    <>
      <AmountCard
        denom={format.denom(denom)}
        amount={available}
        button={
          <ButtonWithName
            onClick={openModal}
            className="btn btn-primary btn-sm btn-send"
            disabled={!name && !withLedger}
          >
            {t('Send')}
          </ButtonWithName>
        }
      />
      <Modal config={modal.config}>{modal.content}</Modal>
    </>
  )
}

export default Available
