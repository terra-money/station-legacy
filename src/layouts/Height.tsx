import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import semver from 'semver'
import { useSocket, Block } from '@terra-money/use-station'
import Flex from '../components/Flex'
import ExtLink from '../components/ExtLink'
import Icon from '../components/Icon'
import Update from './Update'
import s from './Height.module.scss'

const Height = () => {
  const { block, status } = useSocket()

  /* update toast */
  useEffect(() => {
    const parsed = status ? parseVersion(status) : undefined
    const currentVersion = process.env.REACT_APP_VERSION
    const shouldUpdate =
      parsed && currentVersion && !semver.gte(currentVersion, parsed.version)

    shouldUpdate && toast(<Update {...parsed!} />, { toastId: 'App Update' })
    // eslint-disable-next-line
  }, [status])

  const render = ({ formatted, link }: Block) => (
    <>
      <ExtLink href={link}>{formatted}</ExtLink>
      <Icon name="open_in_new" size={12} />
    </>
  )

  return <Flex className={s.height}>{block && render(block)}</Flex>
}

export default Height

/* helper */
const parseVersion = (s: string): VersionWeb | undefined => {
  try {
    return JSON.parse(s)
  } catch (error) {
    return undefined
  }
}
