import React, { useState, useEffect, ChangeEvent } from 'react'
import c from 'classnames'
import BigNumber from 'bignumber.js'
import { ChainList, useSocket } from '../api/api'
import { useApp } from '../hooks'
import Flex from '../components/Flex'
import Icon from '../components/Icon'
import Select from '../components/Select'
import Finder from '../components/Finder'
import s from './NavFooter.module.scss'

const NavFooter = ({ onChangeChain }: { onChangeChain: () => void }) => {
  const { chain, selectChain } = useApp()
  const socket = useSocket(chain)

  /* state */
  const [height, setHeight] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error>()

  /* event: Change chain */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    selectChain(e.target.value)
    onChangeChain()
  }

  /* socket: Latest block height */
  useEffect(() => {
    const onHeight = (height: string) => {
      setError(undefined)
      setIsLoading(false)
      setHeight(height)
    }

    const channel = socket.subscribe('latestBlockHeight')
    channel.watch(onHeight)

    return () => channel.unsubscribe()
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
        <Flex className={s.status}>
          <Icon
            name="signal_wifi_4_bar"
            size={12}
            className={!error ? 'text-success' : 'text-danger'}
          />
          <span>{error || isLoading ? 'Connecting...' : 'Connected'}</span>
        </Flex>

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

export default NavFooter

/* helper */
const formatHeight = (height: string) => new BigNumber(height).toFormat()
