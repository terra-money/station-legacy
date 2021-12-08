import Card from '../../components/Card'
import ExtLink from '../../components/ExtLink'
import Icon from '../../components/Icon'
import useTerraAssets from '../../hooks/useTerraAssets'
import { NFTMarketplace } from '../../types'
import styles from './Marketplace.module.scss'

const Marketplace = () => {
  const { data: markets } = useTerraAssets<NFTMarketplace[]>(
    'cw721/marketplace.json'
  )

  return (
    <article className={styles.wrapper}>
      <Card>
        <div className={styles.header}>
          <Icon name="shopping_bag" size={20} />
          <span className={styles.title}>Marketplace</span>
        </div>

        {markets?.map((market, key) => (
          <ExtLink className={styles.address} href={market.link} key={key}>
            {market.name}
            <Icon name="north_east" size={14} />
          </ExtLink>
        ))}
      </Card>
    </article>
  )
}

export default Marketplace
