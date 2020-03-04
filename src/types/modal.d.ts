interface Modal {
  open: (content?: ReactNode, config?: object) => void
  close: () => void
  setContent: Dispatch<SetStateAction<ReactNode>>
  prevent: Prevent
  content: ReactNode
  config: ReactModal.Props & { onRequestClose: () => void }
  post: PostModal
}

interface PostModal {
  onSubmitting: Prevent
  onSubmitted: () => void
}

type Prevent = (prevent: boolean) => void
