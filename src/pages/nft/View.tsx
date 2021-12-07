import classNames from 'classnames'
import Confirm from '../../components/Confirm'
import ModalContent from '../../components/ModalContent'
import styles from './View.module.scss'

const View = ({ info }: { info?: object }) => {
  const data = JSON.stringify(info, null, 2)
  return (
    <ModalContent>
      <Confirm title="View">
        <textarea
          className={classNames('form-control monospace', styles.field)}
          defaultValue={data}
          rows={12}
          readOnly
        />
      </Confirm>
    </ModalContent>
  )
}

export default View
