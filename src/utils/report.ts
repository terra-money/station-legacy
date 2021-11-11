import { isLocal } from './env'

const verbose = (error: Error) => {
  console.error(error)
  console.groupEnd()
}

export default (error: Error) => {
  if (isLocal) {
    verbose(error)
  }
}
