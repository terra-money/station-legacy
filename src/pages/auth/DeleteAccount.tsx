import React from 'react'
import { useTranslation } from 'react-i18next'
import Confirm from '../../components/Confirm'

type Props = { onDelete: () => void; onCancel: () => void }
const DeleteAccount = ({ onDelete, onCancel }: Props) => {
  const { t } = useTranslation()

  return (
    <Confirm
      icon="error_outline"
      title={t('Delete accounts')}
      actions={[
        {
          children: t('Delete'),
          onClick: onDelete,
          className: 'btn btn-danger'
        },
        { children: t('Cancel'), onClick: onCancel, className: 'btn btn-light' }
      ]}
    >
      {t(
        'Are you sure you want to delete this account? You can restore this account with your seed phrase anytime.'
      )}
    </Confirm>
  )
}

export default DeleteAccount
