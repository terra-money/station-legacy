type Status = 'Deposit' | 'Voting' | 'Passed' | 'Rejected'

interface Governance {
  proposals: ProposalItem[]
  votingPeriod: string
  minDeposit: Coin[]
  maxDepositPeriod: string
}

interface ProposalItem {
  id: string
  proposer: string
  type: string
  status: Status
  submitTime: string
  title: string
  description: string
  deposit: Deposit
  vote?: Vote
}

interface ProposalDetail extends ProposalItem {
  content: Content[]
  tallyingParameters?: TallyingParameters
}

interface Content {
  key: string
  value: string | object[]
}

interface Deposit {
  depositEndTime: string
  totalDeposit: Coin[]
  minDeposit: Coin[]
}

interface TallyingParameters {
  quorum: string
  threshold: string
  veto: string
}

interface Vote {
  id: string
  distribution: Distribution
  count: Count
  total: string
  votingEndTime: string
  stakedLuna: string
}

interface Count {
  [key: string]: number
}

interface Distribution {
  [key: string]: string
}

interface VoteOptions {
  mostVoted?: VoteOption
  list: VoteOption[]
}

interface VoteOption {
  label: string
  ratio: string
  amount: string
}
