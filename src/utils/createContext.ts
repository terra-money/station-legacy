import { createContext, useContext } from 'react'

export default <A>() => {
  const ctx = createContext<A | undefined>(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error('This must be inside a Provider with a value')
    return c
  }

  return [useCtx, ctx.Provider] as const
}
