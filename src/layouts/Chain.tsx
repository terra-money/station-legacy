import { ChangeEvent, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import c from 'classnames'
import useFCD from '../api/useFCD'
import { isExtension, isWeb } from '../utils/env'
import { useCurrentChainName, useManageChain } from '../data/chain'
import { useModal } from '../hooks'
import Select from '../components/Select'
import Modal from '../components/Modal'
import useMergeChains from '../pages/settings/useMergedChains'
import LocalTerraError from './LocalTerraError'
import s from './Chain.module.scss'
import NavStyles from './Nav.module.scss'

const Chain = ({ disabled }: { disabled?: boolean }) => {
  const { set } = useManageChain()
  const currentChainName = useCurrentChainName()
  const modal = useModal()

  const chains = useMergeChains()

  /* check localterra status */
  useCheckLocalTerra(
    () => modal.open(<LocalTerraError modal={modal} />),
    currentChainName
  )

  const { push } = useHistory()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value

    if (!key) {
      // redirect to add a new network
      push('/network')
    } else {
      set(chains[key])
    }
  }

  return isWeb ? (
    <div className={s.select}>{currentChainName}</div>
  ) : (
    <>
      <Select
        value={currentChainName}
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
  const isLocal = chain === 'localterra'
  const { error } = useFCD<object>({ url: '/node_info' }, isLocal)
  const hasError = !!error

  useEffect(() => {
    isLocal && hasError && callback()
    // eslint-disable-next-line
  }, [isLocal, hasError])
}
