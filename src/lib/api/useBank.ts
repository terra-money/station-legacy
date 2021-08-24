import { BankAPI, BankData, User, Balance } from '../types'
import { lt } from '../utils'
import useFCD from './useFCD'

export default ({ address }: User): BankAPI => {
  const { data, ...rest } = useFCD<BankData>({ url: `/v1/bank/${address}` })

  const fixAvailable = (balance: Balance[]): Balance[] =>
    balance.map(({ available, ...rest }) => ({
      ...rest,
      available: lt(available, 0) ? '0' : available,
    }))

  return Object.assign(
    {},
    rest,
    data && {
      data: Object.assign({}, data, { balance: fixAvailable(data.balance) }),
    }
  )
}
