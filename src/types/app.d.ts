interface App {
  setPadding: (padding: boolean) => void
  refresh: () => void

  goBack?: string
  setGoBack: (v: string) => void

  modal: Modal
  authModal: { open: () => void; close: () => void }
}
