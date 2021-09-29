import { useTranslation } from 'react-i18next'
import { useAddress } from '../../../data/auth'
import { ValidatorData, ValidatorPage } from '../../../types'
import useFCD from '../../../api/useFCD'
import useValidatorItem from './useValidatorItem'

export default (validatorAddress: string): ValidatorPage => {
  const { t } = useTranslation()
  const renderValidator = useValidatorItem()

  /* api */
  const address = useAddress()
  const url = `/v1/staking/validators/${validatorAddress}`
  const params = { account: address }
  const response = useFCD<ValidatorData>({ url, params })

  return Object.assign(
    { delegations: t('Page:Staking:Delegations') },
    response,
    response.data && { ui: renderValidator(response.data) }
  )
}
