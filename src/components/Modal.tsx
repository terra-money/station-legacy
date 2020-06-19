import React, { FC } from 'react'
import ReactModal from 'react-modal'
import Icon from './Icon'
import s from './Modal.module.scss'

ReactModal.setAppElement('#root')

type Config = ReactModal.Props & { onRequestClose: () => void }
type Props = { title?: string; config: Config }

const Modal: FC<Props> = ({ title, config, children }) => {
  const modal = {
    ...config,
    overlayClassName: s.overlay,
    className: s.content,
  }

  return (
    <ReactModal {...modal}>
      {title && (
        <header>
          <h1>{title}</h1>
          <button type="button" onClick={modal.onRequestClose}>
            <Icon name="close" />
          </button>
        </header>
      )}

      {children}
    </ReactModal>
  )
}

export default Modal
