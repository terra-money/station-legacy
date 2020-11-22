import React from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '@terra-money/use-station'
import { useChangePassword, useManageAccounts } from '@terra-money/use-station'
import { decrypt } from '../utils'
import { importKey, loadKeys, storeKeys } from '../utils/localStorage'
import { testPassword } from '../utils/localStorage'
import Form from '../components/Form'
import Toast from '../components/Toast'

const ChangePassword = ({ onFinish }: { onFinish?: () => void }) => {
  const accounts = loadKeys()
  const { user } = useAuth()
  const { password: toastText } = useManageAccounts()

  const changePassword = async ({
    current,
    password,
  }: {
    current: string
    password: string
  }) => {
    const account = accounts.find((account) => account.name === user?.name)!
    const { name, wallet } = account
    const decrypted = decrypt(wallet, current)
    const parsed = JSON.parse(decrypted)
    const next = accounts.filter((account) => account.name !== user?.name)
    storeKeys(next)
    await importKey({ name, password, wallet: parsed })
    toast(<Toast {...toastText} />, { autoClose: 3000 })
    onFinish?.()
  }

  const form = useChangePassword({
    name: user!.name!,
    test: ({ name, password }) => testPassword(name, password),
    changePassword,
  })

  return <Form form={form} />
}

export default ChangePassword
