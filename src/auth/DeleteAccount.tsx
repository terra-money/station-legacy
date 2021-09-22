import { useAuth, useUser } from '../data/auth'
import { useManageAccounts } from '../lib'
import { loadKeys, storeKeys } from '../utils/localStorage'
import Confirm from '../components/Confirm'

const DeleteAccount = ({ onFinish }: { onFinish?: () => void }) => {
  const accounts = loadKeys()
  const user = useUser()
  const { signOut } = useAuth()
  const { delete: text } = useManageAccounts()
  const { title, content, button, cancel } = text

  const deleteAccount = () => {
    signOut()
    const next = accounts.filter((account) => account.name !== user!.name)
    storeKeys(next)
  }

  const actions = (
    <>
      <button className="btn btn-danger" onClick={deleteAccount}>
        {button}
      </button>
      <button className="btn btn-light" onClick={onFinish}>
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
