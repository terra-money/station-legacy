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

const SelectChain = ({ disabled }: { disabled?: boolean }) => {
  const { chain } = useConfig()
  const modal = useModal()
  const { current, set } = chain
  const { chains, list } = useMergeChains()

  /* check localterra status */
  useCheckLocalTerra(
    () => modal.open(<LocalTerraError modal={modal} />),
    chain.current.key
  )

  const { push } = useHistory()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value
    localSettings.set({ chain: key })
    key ? set(chains[key]) : push('/network')
  }

  return (
    <>
      <Select
        value={current['key']}
        onChange={handleChange}
        className={c('form-control', s.select)}
        containerClassName={isExtension ? NavStyles.select : undefined}
        icon={isExtension ? 'wifi_tethering' : undefined}
        disabled={disabled}
      >
        {list.map(({ title, list }, index) => (
          <Fragment key={title}>
            {list.map((key) => (
              <option value={key} key={key}>
                {chains[key]?.['name']}
              </option>
            ))}
            {<option disabled>──────────</option>}
          </Fragment>
        ))}

        <option value="">Add a network...</option>
      </Select>
      <Modal config={modal.config}>{modal.content}</Modal>
    </>
  )
}

export default SelectChain

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
