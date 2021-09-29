import { API, DisplayCoin, Pagination, CoinItem, TablePage, TableUI } from '..'
import { PaginationTablePage, PaginationTableUI } from '../common/ui'

export interface ValidatorPage extends API<ValidatorData> {
  delegations: string
  ui?: ValidatorUI
}

export interface ValidatorUI {
  rank?: number

  moniker: string
  profile: string
  details: string
  status: string
  link: string

  operatorAddress: { title: string; address: string }
  accountAddress: { title: string; address: string; link?: string }

  votingPower: { title: string; percent: string; display: DisplayCoin }
  selfDelegation: { title: string; percent?: string; display?: DisplayCoin }

  commission: { title: string; percent: string }
  maxRate: { title: string; percent: string }
  maxChangeRate: { title: string; percent: string }
  updateTime: { title: string; date: string }
  uptime: { title: string; desc: string; percent: string }

  myDelegations: { title: string; display?: DisplayCoin; percent?: string }
  myUndelegations: { title: string; display?: DisplayCoin; percent?: string }
  myRewards: { title: string; display?: DisplayCoin; amounts?: DisplayCoin[] }
  myActionsTable?: MyActionsTable

  /* buttons */
  delegate: { children: string; disabled: boolean }
  redelegate: { children: string; disabled: boolean }
  undelegate: { children: string; disabled: boolean }
  withdraw: { children: string; disabled: boolean }
}

export interface MyActionsTable {
  headings: { action: string; display: string; date: string }
  contents: MyActionContent[]
}

export interface MyActionContent {
  action: string
  display: DisplayCoin
  date: string
}

export type ClaimsPage = TablePage<ClaimsData, ClaimsTable>
export type ClaimsUI = TableUI<ClaimsTable>

export interface ClaimsTable {
  headings: { hash: string; type: string; displays: string; date: string }
  contents: ClaimContent[]
}

export interface ClaimContent {
  link: string
  hash: string
  type: string
  displays: DisplayCoin[]
  date: string
}

export type DelegationsPage = TablePage<DelegationsData, DelegationsTable>
export type DelegationsUI = TableUI<DelegationsTable>

export interface DelegationsTable {
  headings: { hash: string; type: string; change: string; date: string }
  contents: DelegationContent[]
}

export interface DelegationContent {
  link: string
  hash: string
  type: string
  display: DisplayCoin
  date: string
}

export type DelegatorsPage = PaginationTablePage<
  DelegatorsData,
  DelegatorsTable
>

export type DelegatorsUI = PaginationTableUI<DelegatorsTable>

export interface DelegatorsTable {
  headings: { address: string; display: string; weight: string }
  contents: DelegatorContent[]
}

export interface DelegatorContent {
  link: string
  address: string
  display: DisplayCoin
  weight: string
}

/* data */
export interface ValidatorData {
  accountAddress: string
  operatorAddress: string
  description: Description
  votingPower: VotingPower
  selfDelegation: VotingPower
  commissionInfo: CommissionInfo
  stakingReturn: string
  upTime: number
  status: string
  rewardsPool: Rewards
  isNewValidator: boolean
  myUndelegation?: MyUndelegation[]
  myDelegatable: string
  myDelegation?: string
  myRewards?: Rewards
}

export interface Description {
  moniker: string
  identity: string
  website: string
  details: string
  profileIcon: string
}

export interface VotingPower {
  amount: string
  weight: string
}

export interface CommissionInfo {
  rate: string
  maxRate: string
  maxChangeRate: string
  updateTime: any
}

export interface Rewards {
  total: string
  denoms: Reward[]
}

export interface Reward {
  denom: string
  amount: string
  adjustedAmount: string
}

export interface MyUndelegation {
  releaseTime: string
  amount: string
  validatorName: string
  validatorAddress: string
}

export interface ClaimsData {
  claims: Claim[]
  limit: number
  next: number
}

export interface DelegationsData {
  events: Event[]
  limit: number
  next: number
}

export interface DelegatorsData extends Pagination {
  delegators?: Delegator[]
}

export interface Claim {
  txhash: string
  type: string
  amounts?: CoinItem[]
  timestamp: string
}

export interface Event {
  txhash: string
  height: string
  type: string
  amount: CoinItem
  timestamp: string
}

export interface Delegator {
  address: string
  amount: string
  weight: string
}
