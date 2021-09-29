import { useHeight, HeightData } from '../lib'
import Flex from '../components/Flex'
import ExtLink from '../components/ExtLink'
import Icon from '../components/Icon'
// import Update from './Update'
import s from './Height.module.scss'

/* helper */
// const parseVersion = (s: string): VersionWeb | undefined => {
//   try {
//     return JSON.parse(s)
//   } catch (error) {
//     return undefined
//   }
// }

const Height = () => {
  const height = useHeight()

  /* update toast */
  // useEffect(() => {
  //   const parsed = status ? parseVersion(status) : undefined
  //   const currentVersion = process.env.REACT_APP_VERSION
  //   const shouldUpdate =
  //     parsed && currentVersion && !semver.gte(currentVersion, parsed.version)

  //   shouldUpdate && toast(<Update {...parsed!} />, { toastId: 'App Update' })
  //   // eslint-disable-next-line
  // }, [status])

  const render = ({ formatted, link }: HeightData) => (
    <>
      <ExtLink href={link}>{formatted}</ExtLink>
      <Icon name="open_in_new" size={12} />
    </>
  )

  return <Flex className={s.height}>{height && render(height)}</Flex>
}

export default Height
