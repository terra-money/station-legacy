import React from 'react'
import { useForm } from '@terra-money/use-station'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'
import { useApp } from '../../hooks'
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

  const { refresh } = useApp()

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
      const { customNetworks = [] } = localSettings.get()
      ws &&
        localSettings.set({
          customNetworks: [...customNetworks, { ...values, ws }],
        })
      refresh()
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
