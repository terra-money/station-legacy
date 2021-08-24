import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PostPage, Field, QueryResult } from '../../types'
import { is, format } from '../../utils'
import fcd from '../../api/fcd'
import useForm from '../../hooks/useForm'

interface Values {
  address: string
  json: string
}

export default (address: string): PostPage<QueryResult> => {
  const { t } = useTranslation()
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState()
  const [submitted, setSubmitted] = useState(false)

  /* form */
  const validate = ({ json }: Values) => ({
    address: '',
    json: !is.json(json)
      ? t('Common:Validate:{{label}} is invalid', { label: 'JSON' })
      : '',
  })
  const initial = { address, json: '' }
  const form = useForm<Values>(initial, validate)
  const { values, invalid, getDefaultProps, getDefaultAttrs } = form

  /* submit */
  const submit = async () => {
    try {
      const url = `/wasm/contracts/${address}/store`
      const params = { query_msg: format.sanitizeJSON(values.json) }
      const { data } = await fcd.get<string>(url, { params })
      setOutput(JSON.stringify(data, null, 2))
    } catch (error) {
      setError(error)
    } finally {
      setSubmitted(true)
    }
  }

  /* render */
  const fields: Field[] = [
    {
      ...getDefaultProps('address'),
      label: t('Post:Contracts:Contract address'),
      attrs: { ...getDefaultAttrs('address'), readOnly: true },
    },
    {
      ...getDefaultProps('json'),
      element: 'textarea',
      label: t('Post:Contracts:QueryMsg JSON'),
      attrs: getDefaultAttrs('json'),
    },
  ]

  const disabled = invalid

  const formUI = {
    title: t('Post:Contracts:Query'),
    fields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => submit(),
  }

  return {
    error,
    submitted,
    form: formUI,
    ui: !output
      ? undefined
      : {
          title: t('Post:Contracts:Query result'),
          label: t('Post:Contracts:JSON output'),
          content: output,
        },
  }
}
