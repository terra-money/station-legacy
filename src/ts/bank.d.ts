interface Bank {
  balance: Balance[]
  vesting: Vesting[]
  delegations: Delegation[]
  unbondings: Unbonding[]
}

interface Balance {
  denom: string
  available: string
  delegatable: string
}

interface Vesting {
  denom: string
  total: string
  schedules: Schedule[]
}

interface Schedule {
  amount: string
  startTime: number
  endTime: number
  ratio: number
  freedRate: number
}

interface Delegation {
  delegator_address: string
  validator_address: string
  amount: string
}

interface Unbonding {
  delegator_address: string
  validator_address: string
  entries: Entry[]
}

interface Entry {
  creation_height: string
  completion_time: string
  initial_balance: string
  balance: string
}
