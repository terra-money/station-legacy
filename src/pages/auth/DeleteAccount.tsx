import React from 'react'
import Confirm from '../../components/Confirm'

type Props = { onDelete: () => void; onCancel: () => void }
const DeleteAccount = ({ onDelete, onCancel }: Props) => (
  <Confirm
    icon="error_outline"
    title="Delete accounts"
    actions={[
      { children: 'Delete', onClick: onDelete, className: 'btn btn-danger' },
      { children: 'Cancel', onClick: onCancel, className: 'btn btn-light' }
    ]}
  >
    Are you sure you want to delete this account? You can restore this account
    with your seed phrase anytime.
  </Confirm>
)

export default DeleteAccount
