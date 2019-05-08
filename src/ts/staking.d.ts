interface Staking {
  availableLuna?: string
  delegationTotal?: string
  undelegations?: Undelegation[]
  rewards?: { denoms: Reward[]; total: string }
  myDelegations?: StakingDelegation[]
  validators: Validator[]
}

interface StakingDelegation {
  validatorAddress: string
  validatorName: string
  amountDelegated: string
  totalReward: string
}

interface Undelegation {
  validatorName: string
  amount: string
  releaseTime: string
}
