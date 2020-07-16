import React from 'react'
import { useRecentAddresses } from '@terra-money/use-station'
import { localSettings } from '../utils/localStorage'
import Icon from '../components/Icon'
import ButtonGroup from '../components/ButtonGroup'

const RecentAddresses = ({ onDeleteAll }: { onDeleteAll: () => void }) => {
  const { recentAddresses: local = [] } = localSettings.get()
  const { title, deleteAll, buttons } = useRecentAddresses(local)

  const handleDeleteAll = () => {
    localSettings.delete(['recentAddresses'])
    onDeleteAll()
  }

  return !buttons.length ? null : (
    <section className="form-group">
      <header className="flex space-between">
        <label className="label">{title}</label>
        <button
          type="button"
          className="label-button text-danger"
          onClick={handleDeleteAll}
        >
          <Icon name="delete" size={12} />
          {deleteAll}
        </button>
      </header>

      <ButtonGroup buttons={buttons} truncate wrap />
    </section>
  )
}

export default RecentAddresses
