import React, { useState, useEffect, ChangeEvent } from 'react'
import c from 'classnames'
import BigNumber from 'bignumber.js'
import api, { ChainList } from '../api/api'
import { useApp } from '../hooks'
import Flex from '../components/Flex'
import Icon from '../components/Icon'
import Select from '../components/Select'
import Finder from '../components/Finder'
import s from './NavFooter.module.scss'

const NavFooter = ({ onChangeChain }: { onChangeChain: () => void }) => {
  const { chain, selectChain, key } = useApp()

  /* event: Change chain */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    selectChain(e.target.value)
    onChangeChain()
  }

  /* onMount: Latest block */
  const [height, setHeight] = useState<string>()
  const [error, setError] = useState<Error>()
  const [timeoutId, setTimeoutId] = useState()

  useEffect(() => {
    const request = async () => {
      try {
        type Latest = { block: { header: { height: string } } }
        const { data } = await api.get<Latest>('/blocks/latest')
        setError(undefined)
        setHeight(data.block.header.height)
      } catch (error) {
        setError(error)
        const id = setTimeout(() => request(), 5000)
        setTimeoutId(id)
      }
    }

    request()
  }, [key])

  useEffect(() => {
    return () => clearTimeout(timeoutId)
  }, [timeoutId])

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
          <span>{!error ? 'Connected' : 'Connecting...'}</span>
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
