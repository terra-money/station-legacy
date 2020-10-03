import React, { ChangeEvent, Fragment, useEffect } from 'react'
import c from 'classnames'
import { useConfig, useNodeInfo } from '@terra-money/use-station'
import { Chains, list } from '../chains'
import { localSettings } from '../utils/localStorage'
import { useModal } from '../hooks'
import Select from '../components/Select'
import Modal from '../components/Modal'
import LocalTerraError from './LocalTerraError'
import s from './Chain.module.scss'

const SelectChain = () => {
  const { chain } = useConfig()
  const modal = useModal()
  const { current, set } = chain

  /* check localterra status */
  useCheckLocalTerra(
    () => modal.open(<LocalTerraError modal={modal} />),
    chain.current.key
  )

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    localSettings.set({ chain: e.target.value })
    set(Chains[e.target.value])
  }

  return (
    <>
      <Select
        value={current['key']}
        onChange={handleChange}
        className={c('form-control', s.select)}
      >
        {list.map(({ title, list }, index) => (
          <Fragment key={title}>
            {!!index && <option disabled>──────────</option>}
            {list.map((key) => (
              <option value={key} key={key}>
                {Chains[key]?.['name']}
              </option>
            ))}
          </Fragment>
        ))}
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
