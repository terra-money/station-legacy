import Icon from '../components/Icon'
import Flex from '../components/Flex'
import ExtLink from '../components/ExtLink'
import s from './Guide.module.scss'

const LINK =
  'https://docs.terra.money/Tutorials/Get-started/Terra-Station-desktop.html'

const Guid = () => (
  <ExtLink href={LINK} className={s.component}>
    <Flex>
      <Icon name="help" />
      Tutorial
    </Flex>
  </ExtLink>
)

export default Guid
