import React from 'react'
import { useQuery } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import Post from './Post'

const Query = ({ address }: { address: string }) => {
  const { modal } = useApp()
  const response = useQuery(address)
  const { ui } = response

  return !ui ? (
    <Post post={response} />
  ) : (
    <ModalContent {...modal}>
      <Confirm title={ui.title}>
        <label className="label">{ui.label}</label>
        <textarea
          className="form-control monospace"
          defaultValue={ui.content}
          rows={12}
          readOnly
        />
      </Confirm>
    </ModalContent>
  )
}

export default Query
