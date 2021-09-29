import { API } from '..'

export type BankAPI = API<BankData>

export interface BankData {
  balance: Balance[]
  vesting: Vesting[]
  delegations: Delegation[]
  unbondings: Unbonding[]
}

export interface Balance {
  denom: string
  available: string
  delegatable: string
}

export interface Vesting {
  denom: string
  total: string
  schedules: Schedule[]
}

export interface Schedule {
  amount: string
  startTime: number
  endTime: number
  ratio: number
  freedRate: number
}

export interface Delegation {
  delegator_address: string
  validator_address: string
  amount: string
}

export interface Unbonding {
  delegator_address: string
  validator_address: string
}
