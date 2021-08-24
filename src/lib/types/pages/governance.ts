import { Dictionary } from 'ramda'
import { API, Coin, DisplayCoin, Voter, Article } from '..'

export interface GovernancePage extends API<ProposalsData> {
  ui?: GovernanceUI
  propose: { attrs: { children: string } }
}

export interface GovernanceUI {
  params: GovernanceParamUI[]
  message?: string
  list?: ProposalItemUI[]
}

export interface GovernanceParamUI {
  title: string
  content?: string
  displays?: DisplayCoin[]
}

export interface ProposalItemUI {
  id: string
  status: string
  statusTranslation: string
  title: string
  meta: string
  deposit?: {
    ratio: string
    completed?: string
    contents: Article[]
  }
  vote?: {
    list: VoteOption[]
    contents: Article[]
  }
}

export interface VoteOptions {
  mostVoted?: VoteOption
  list: VoteOption[]
}

export interface VoteOption {
  label: string
  ratio: string
  display: DisplayCoin
  color: string
}

/* data */
export interface ProposalsData {
  proposals: ProposalItemData[]
  votingPeriod: string
  minDeposit: Coin[]
  maxDepositPeriod: string
}

export interface ProposalItemData {
  id: string
  proposer: Voter
  type: string
  status: ProposalStatus
  submitTime: string
  title: string
  description: string
  deposit: Deposit
  vote?: Vote
}

export type ProposalStatus = '' | 'Deposit' | 'Voting' | 'Passed' | 'Rejected'

export interface Deposit {
  depositEndTime: string
  totalDeposit: Coin[]
  minDeposit: Coin[]
}

export interface Vote {
  id: string
  distribution: Dictionary<string>
  count: Dictionary<number>
  total: string
  votingEndTime: string
  stakedLuna: string
}
