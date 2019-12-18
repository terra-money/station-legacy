interface Validator {
  accountAddress: string
  operatorAddress: string
  description: Description
  votingPower: VotingPower
  selfDelegation: VotingPower
  commissions: Reward[]
  commissionInfo: CommissionInfo
  stakingReturn: string
  upTime: number
  status: string
  rewardsPool: Rewards
  myUndelegation?: MyUndelegation[]
  myDelegatable: string
  myDelegation: string
  myRewards?: Rewards
}

interface Description {
  moniker: string
  identity: string
  website: string
  details: string
  profileIcon: string
}

interface VotingPower {
  amount: string
  weight: string
}

interface CommissionInfo {
  rate: string
  maxRate: string
  maxChangeRate: string
  updateTime: any
}

interface Rewards {
  total: string
  denoms: Reward[]
}

interface Reward {
  denom: string
  amount: string
  adjustedAmount: string
}

interface MyUndelegation {
  releaseTime: string
  amount: string
  validatorName: string
  validatorAddress: string
}
