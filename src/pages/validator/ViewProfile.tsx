import src from './ViewProfile.png'
import useValidators from '../../hooks/useValidators'
import ExtLink from '../../components/ExtLink'
import styles from './ViewProfile.module.scss'

const PROJECT = 'https://github.com/terra-money/validator-profiles'
const PATH = '/tree/master/validators/'

const ViewProfile = ({ address }: { address: string }) => {
  const { data: validators } = useValidators()

  const link = [PROJECT, PATH, address].join('')
  const size = { width: 170, height: 52 }
  const invalid = !validators?.[address]

  return invalid ? null : (
    <ExtLink href={link} className={styles.link}>
      <img src={src} {...size} alt="View profile on Terra Validators" />
    </ExtLink>
  )
}

export default ViewProfile
