import { useInfo, PostPage } from '../lib'
import { useApp } from '../hooks'
import Form, { Props as FormProps } from '../components/Form'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import Confirmation from './Confirmation'

interface Props {
  post: PostPage
  formProps?: Partial<FormProps>
  onFinish?: () => Promise<void>
}

const Post = ({ post, formProps, onFinish }: Props) => {
  const { error, loading, submitted, form, confirm } = post
  const { modal } = useApp()
  const { ERROR } = useInfo()

  return error ? (
    <ModalContent close={modal.close}>
      <Confirm {...ERROR} />
    </ModalContent>
  ) : loading ? (
    <ProgressCircle center />
  ) : !submitted ? (
    <ModalContent close={modal.close}>
      {form && <Form form={form} {...formProps} />}
    </ModalContent>
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} onFinish={onFinish} />
  ) : null
}

export default Post
