import { importKey } from '../utils/localStorage'
import Form from '../components/Form'
import ErrorComponent from '../components/ErrorComponent'
import useImportKey from '../hooks/auth/useImportKey'

const ImportKey = () => {
  const { form, error } = useImportKey({
    onSuccess: importKey,
  })

  return error ? (
    <ErrorComponent error={error}>{error.message}</ErrorComponent>
  ) : (
    <Form form={form} />
  )
}

export default ImportKey
