import { useMarket, useMenu } from '../../lib'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Page from '../../components/Page'
import Swap from '../../post/Swap'
import Price from './Price'
import RateList from './RateList'

const Market = () => {
  const { Swap: title } = useMenu()
  const { error, loading, ui, swap } = useMarket()

  const render = (actives: string[]) => (
    <>
      <div className="row">
        <div className="col col-6">
          <Price />
        </div>

        <div className="col col-6">
          <RateList denoms={actives} />
        </div>
      </div>

      <Swap title={swap} actives={actives} />
    </>
  )

  return (
    <Page title={title}>
      {error ? (
        <ErrorComponent error={error} card />
      ) : loading ? (
        <Loading card />
      ) : (
        ui && render(ui.actives)
      )}
    </Page>
  )
}

export default Market
