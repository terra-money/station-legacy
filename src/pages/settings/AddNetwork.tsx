import React from 'react'
import { useHistory } from 'react-router-dom'
import { useForm, useConfig, ChainOptions } from '../../use-station/src'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'
import Form from '../../components/Form'
import useMergeChains, { validateNetwork } from './useMergeChains'

const AddNetwork = () => {
  const chains = useMergeChains()
  const { chain } = useConfig()
  const { push } = useHistory()

  /* form */
  const initial = { name: '', chainID: '', lcd: '', fcd: '', localterra: false }
  const validate = ({ name, chainID, lcd, fcd }: ChainOptions) => ({
    name: !name ? 'Required' : chains[name] ? 'Already exists' : '',
    chainID: !chainID ? 'Required' : '',
    lcd: !lcd ? 'Required' : '',
    fcd: !fcd ? 'Required' : '',
    localterra: '',
  })

  const form = useForm(initial, validate)
  const { values, invalid, getDefaultAttrs, getDefaultProps } = form

  const sample = Chains['mainnet']
  const fields = [
    {
      label: 'name',
      ...getDefaultProps('name'),
      attrs: { ...getDefaultAttrs('name'), placeholder: sample['name'] },
    },
    {
      label: 'chain id',
      ...getDefaultProps('chainID'),
      attrs: { ...getDefaultAttrs('chainID'), placeholder: sample['chainID'] },
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
      label: 'LocalTerra network',
      ...getDefaultProps('localterra'),
      attrs: { ...getDefaultAttrs('localterra'), type: 'checkbox' as const },
    },
  ]

  const formUI = {
    title: 'Add a new network',
    fields,
    disabled: invalid,
    submitLabel: 'Add',
    onSubmit: () => {
      const { customNetworks = [] } = localSettings.get()
      const next = values

      localSettings.set({
        customNetworks: [...customNetworks.filter(validateNetwork), next],
        chain: values.name,
      })

      chain.set(next)
      push('/')
    },
  }

  return <Form form={formUI} />
}

export default AddNetwork
