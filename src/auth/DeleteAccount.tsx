import React from 'react'
import { useManageAccounts } from '@terra-money/use-station'
import Confirm from '../components/Confirm'

type Props = { onDelete: () => void; onCancel: () => void }
const DeleteAccount = ({ onDelete, onCancel }: Props) => {
  const { delete: t } = useManageAccounts()
  const { title, content, button, cancel } = t

  const actions = (
    <>
      <button className="btn btn-danger" onClick={onDelete}>
        {button}
      </button>
      <button className="btn btn-light" onClick={onCancel}>
        {cancel}
      </button>
    </>
  )

  return (
    <Confirm icon="error_outline" title={title} footer={actions}>
      {content}
    </Confirm>
  )
}

export default DeleteAccount
