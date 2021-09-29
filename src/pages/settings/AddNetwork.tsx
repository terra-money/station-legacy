import { useForm, ChainOptions } from '../../lib'
import Form from '../../components/Form'
import useMergeChains, { useAddNetwork } from './useMergedChains'

const AddNetwork = () => {
  const chains = useMergeChains()
  const addNetwork = useAddNetwork()

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

  const sample = chains['mainnet']
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
    onSubmit: () => addNetwork(values),
  }

  return <Form form={formUI} />
}

export default AddNetwork
