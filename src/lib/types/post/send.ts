export interface RecentSentUI {
  title: string
  contents: RecentSentItemUI[]
}

export interface RecentSentItemUI {
  title: string
  contents: { title: string; content: string }[]
  onClick: () => void
}
