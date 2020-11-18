import React from 'react'
import { useHistory } from 'react-router-dom'
import { useForm, useConfig } from '@terra-money/use-station'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'
import Form from '../../components/Form'
import useMergeChains from './useMergeChains'

interface Values {
  key: string
  name: string
  lcd: string
  fcd: string
  ws: string
}

const AddNetwork = () => {
  const { chains } = useMergeChains()
  const { chain } = useConfig()
  const { push } = useHistory()

  /* form */
  const initial = { key: '', name: '', lcd: '', fcd: '', ws: '' }
  const validate = ({ key, name, fcd, ws }: Values) => ({
    key: !key
      ? 'Reqruied'
      : Object.keys(chains).includes(key)
      ? 'Already exists'
      : '',
    name: !name ? 'Required' : '',
    lcd: '',
    fcd: !fcd ? 'Required' : '',
    ws: !ws ? 'Required' : !parseWS(ws) ? 'Invalid' : '',
  })

  const form = useForm(initial, validate)
  const { values, invalid, getDefaultAttrs, getDefaultProps } = form

  const sample = Chains['columbus']
  const fields = [
    {
      label: 'key',
      ...getDefaultProps('key'),
      attrs: { ...getDefaultAttrs('key'), placeholder: sample['key'] },
    },
    {
      label: 'chain id',
      ...getDefaultProps('name'),
      attrs: { ...getDefaultAttrs('name'), placeholder: sample['name'] },
    },
    {
      label: 'lcd',
      ...getDefaultProps('lcd'),
      attrs: { ...getDefaultAttrs('lcd'), placeholder: sample['lcd'] },
    },
    {
      label: 'fcd',
      ...getDefaultProps('fcd'),
      attrs: { ...getDefaultAttrs('fcd'), placeholder: sample['fcd'] },
    },
    {
      label: 'ws',
      ...getDefaultProps('ws'),
      attrs: {
        ...getDefaultAttrs('ws'),
        placeholder: JSON.stringify(sample['ws']),
      },
    },
  ]

  const formUI = {
    title: 'Add a new network',
    fields,
    disabled: invalid,
    submitLabel: 'Add',
    onSubmit: () => {
      const ws = parseWS(values.ws)

      if (ws) {
        const { customNetworks = [] } = localSettings.get()
        const next = { ...values, ws }

        localSettings.set({
          customNetworks: [...customNetworks, next],
          chain: values.key,
        })

        chain.set(next)
        push('/')
      }
    },
  }

  return <Form form={formUI} />
}

export default AddNetwork

/* helpers */
const parseWS = (str: string): WebSocketOption | undefined => {
  try {
    return JSON.parse(str)
  } catch {
    return
  }
}
