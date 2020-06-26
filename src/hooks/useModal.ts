import { useState, ReactNode } from 'react'

const portalClassName = 'TerraModalPortal'
export default (): Modal => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [config, setConfig] = useState<object>({})
  const [preventClose, setPreventClose] = useState<boolean>(false)

  const appendConfig = (object: object = {}) => {
    setConfig({ ...config, ...object })
  }

  const open = (content: ReactNode = null, config: object = {}) => {
    appendConfig(config)
    setContent(content)
    setIsOpen(true)
  }

  const close = () => {
    !preventClose && setConfig({})
    !preventClose && setContent(null)
    !preventClose && setIsOpen(false)
  }

  const prevent = (prevent: boolean) => {
    setPreventClose(prevent)
    appendConfig({
      shouldCloseOnOverlayClick: !prevent,
      shouldCloseOnEsc: !prevent,
    })
  }

  const post = { onSubmitting: prevent, onSubmitted: close }
  const actions = { open, close, setContent, prevent, post }
  const defaultConfig = { isOpen, onRequestClose: close, portalClassName }
  return { ...actions, content, config: { ...defaultConfig, ...config } }
}
