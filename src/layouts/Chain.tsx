import React, { ChangeEvent, Fragment, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import c from 'classnames'
import { useConfig, useNodeInfo } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import { localSettings } from '../utils/localStorage'
import { useModal } from '../hooks'
import Select from '../components/Select'
import Modal from '../components/Modal'
import useMergeChains from '../pages/settings/useMergeChains'
import LocalTerraError from './LocalTerraError'
import s from './Chain.module.scss'
import NavStyles from './Nav.module.scss'

const Chain = ({ disabled }: { disabled?: boolean }) => {
  const { chain } = useConfig()
  const modal = useModal()
  const { current, set } = chain
  const chains = useMergeChains()

  /* check localterra status */
  useCheckLocalTerra(
    () => modal.open(<LocalTerraError modal={modal} />),
    chain.current.name
  )

  const { push } = useHistory()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value

    if (!key) {
      // redirect to add a new network
      push('/network')
    } else {
      localSettings.set({ chain: key })
      set(chains[key])
    }
  }

  return (
    <>
      <Select
        value={current['name']}
        onChange={handleChange}
        className={c('form-control', s.select)}
        containerClassName={isExtension ? NavStyles.select : undefined}
        icon={isExtension ? 'wifi_tethering' : undefined}
        disabled={disabled}
      >
        {Object.keys(chains).map((key) => (
          <option value={key} key={key}>
            {key}
          </option>
        ))}

        <option value="">Add a network...</option>
      </Select>
      <Modal config={modal.config}>{modal.content}</Modal>
    </>
  )
}

export default Chain

/* hook */
const useCheckLocalTerra = (callback: () => void, chain?: string) => {
  const { error } = useNodeInfo()
  const hasError = !!error
  const isLocal = chain === 'localterra'

  useEffect(() => {
    isLocal && hasError && callback()
    // eslint-disable-next-line
  }, [isLocal, hasError])
}
