import React, { useState, useEffect, ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import c from 'classnames'
import BigNumber from 'bignumber.js'
import semver from 'semver'
import { ChainList, useSocket } from '../api/api'
import { useApp } from '../hooks'
import Flex from '../components/Flex'
import Icon from '../components/Icon'
import Select from '../components/Select'
import Finder from '../components/Finder'
import AppUpdate from './AppUpdate'
import s from './SelectChain.module.scss'

const SelectChain = ({ onChangeChain }: { onChangeChain: () => void }) => {
  const { chain, selectChain } = useApp()
  const socket = useSocket(chain)

  /* state */
  const [height, setHeight] = useState<string>('')

  /* event: Change chain */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    selectChain(e.target.value)
    onChangeChain()
  }

  /* socket: Latest block height */
  useEffect(() => {
    const checkVersion = (s: string) => {
      const pop = (status: VersionWeb) => {
        const currentVersion = process.env.REACT_APP_VERSION
        const shouldUpdate =
          currentVersion && !semver.gte(currentVersion, status.version)

        shouldUpdate &&
          toast(<AppUpdate {...status} />, { toastId: 'App Update' })
      }

      const status = parseVersion(s)
      status && pop(status)
    }

    const channelHeight = socket.subscribe('latestBlockHeight')
    const channelStatus = socket.subscribe('stationStatus')

    channelHeight.watch(setHeight)
    channelStatus.watch(checkVersion)

    return () => {
      channelHeight.unsubscribe()
      channelStatus.unsubscribe()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <article className={s.component}>
      <Select
        name="chain"
        value={chain}
        onChange={handleChange}
        className={c('form-control', s.select)}
      >
        {ChainList.map(name => (
          <option value={name} key={name}>
            {name}
          </option>
        ))}
      </Select>

      <section className={s.connect}>
        {height && (
          <Flex className={s.height}>
            <Finder q="blocks" v={height}>
              {`#${formatHeight(height)}`}
            </Finder>
            <Icon name="open_in_new" size={12} />
          </Flex>
        )}
      </section>
    </article>
  )
}

export default SelectChain

/* helper */
const formatHeight = (height: string) => new BigNumber(height).toFormat()

const parseVersion = (s: string): VersionWeb | undefined => {
  try {
    return JSON.parse(s)
  } catch (error) {
    return undefined
  }
}
