import api from './api'

export default async (from: string): Promise<object> => {
  /* latest */
  const { data: latest } = await api.get('/blocks/latest')
  const { chain_id } = latest.block.header

  /* account */
  const { data: account } = await api.get(`/auth/accounts/${from}`)
  const { account_number, sequence } = getValue(account)

  return { from, chain_id, account_number, sequence }
}

/* helpers */
enum AccountType {
  STANDARD = 'auth/Account',
  VESTING = 'core/LazyGradedVestingAccount'
}

interface StandardAccount {
  type: AccountType.STANDARD
  value: AccountValue
}

interface VestingAccount {
  type: AccountType.VESTING
  value: { BaseVestingAccount: { BaseAccount: AccountValue } }
}

interface AccountValue {
  account_number: string
  sequence: string
}

const getValue = (account: StandardAccount | VestingAccount): AccountValue =>
  account.type === AccountType.STANDARD
    ? account.value
    : account.value.BaseVestingAccount.BaseAccount
