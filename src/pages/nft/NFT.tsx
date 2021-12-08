import useMenu from '../hooks/useMenu'
import Page from '../../components/Page'
import Flex from '../../components/Flex'
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
          <Flex className={styles.wrapper}>
            <NFTDetails />
            <Marketplace />
          </Flex>
        )}
      </WithAuth>
    </Page>
  )
}

export default NFT
