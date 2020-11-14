import React from 'react'
import { useForm } from '@terra-money/use-station'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'
import { useApp } from '../../hooks'
import Form from '../../components/Form'

const AddNetwork = () => {
  const initial = { key: '', name: '', lcd: '', fcd: '', ws: '' }
  const validate = () => ({ key: '', name: '', lcd: '', fcd: '', ws: '' })

  const { refresh } = useApp()

  const form = useForm(initial, validate)
  const { values, getDefaultAttrs, getDefaultProps } = form

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
    disabled: false,
    submitLabel: 'Add',
    onSubmit: () => {
      const ws = JSON.parse(values.ws)
      const { customNetworks = [] } = localSettings.get()
      localSettings.set({
        customNetworks: [...customNetworks, { ...values, ws }],
      })
      refresh()
    },
  }

  return <Form form={formUI} />
}

export default AddNetwork
