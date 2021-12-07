import useMenu from '../hooks/useMenu'
import Page from '../../components/Page'
import WithAuth from '../../auth/WithAuth'
import Marketplace from './Marketplace'
import NFTDetails from './NFTDetails'
import styles from './NFT.module.scss'

const NFT = () => {
  const { NFT: title } = useMenu()
  return (
    <Page title={title}>
      <WithAuth card>
        {() => (
          <section className={styles.wrapper}>
            <NFTDetails />
            <Marketplace />
          </section>
        )}
      </WithAuth>
    </Page>
  )
}

export default NFT
