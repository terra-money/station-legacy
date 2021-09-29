import { useTranslation } from 'react-i18next'
import { Dictionary } from 'ramda'

export default (): Dictionary<string> => {
  const { t } = useTranslation()

  return {
    Dashboard: t('Page:Menu:Dashboard'),
    Wallet: t('Page:Menu:Wallet'),
    History: t('Page:Menu:History'),
    Staking: t('Page:Menu:Staking'),
    Validator: t('Page:Menu:Validator details'),
    Swap: t('Page:Menu:Swap'),
    Governance: t('Page:Menu:Governance'),
    Proposal: t('Page:Menu:Proposal details'),
    Contracts: t('Page:Menu:Contracts'),
  }
}
