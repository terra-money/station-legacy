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
  STANDARD = 'core/Account',
  VESTING = 'core/LazyGradedVestingAccount'
}

interface StandardAccount {
  result: {
    type: AccountType.STANDARD
    value: AccountValue
  }
}

interface VestingAccount {
  result: {
    type: AccountType.VESTING
    value: { BaseVestingAccount: { BaseAccount: AccountValue } }
  }
}

interface AccountValue {
  account_number: string
  sequence: string
}

const getValue = (account: StandardAccount | VestingAccount): AccountValue =>
  account.result.type === AccountType.STANDARD
    ? account.result.value
    : account.result.value.BaseVestingAccount.BaseAccount
