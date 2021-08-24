import { gql } from '@apollo/client'

interface Item {
  token: string
  contract: string
  msg: object
}

const aliasItem = ({ token, contract, msg }: Item) => `
    ${token}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

export default (list: Item[]) => gql`
  query {
    ${list.map(aliasItem)}
  }
`

export const stringify = (msg: object) =>
  JSON.stringify(msg).replace(/"/g, '\\"')
