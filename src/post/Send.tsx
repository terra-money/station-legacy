import { useSend } from '../lib'
import useTokenBalance from '../cw20/useTokenBalance'
import FormInformation from '../components/FormInformation'
import ExtLink from '../components/ExtLink'
import Post from './Post'

const Send = ({ denom }: { denom: string }) => {
  const tokenBalance = useTokenBalance()
  const response = useSend(denom, tokenBalance)

  const formProps = {
    renderBeforeFields: () => (
      <FormInformation>
        <p>
          Use <ExtLink href="https://bridge.terra.money">Terra Bridge</ExtLink>{' '}
          for cross-chain transfers
        </p>
      </FormInformation>
    ),
  }

  return <Post post={response} formProps={formProps} />
}

export default Send
