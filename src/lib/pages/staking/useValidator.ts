import { useTranslation } from 'react-i18next'
import { User, ValidatorData, ValidatorPage } from '../../types'
import useFCD from '../../api/useFCD'
import useValidatorItem from './useValidatorItem'

export default (address: string, user?: User): ValidatorPage => {
  const { t } = useTranslation()
  const renderValidator = useValidatorItem()

  /* api */
  const url = `/v1/staking/validators/${address}`
  const params = { account: user?.address }
  const response = useFCD<ValidatorData>({ url, params })

  return Object.assign(
    { delegations: t('Page:Staking:Delegations') },
    response,
    response.data && { ui: renderValidator(response.data) }
  )
}
