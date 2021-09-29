import fr from './fr.json'

type Obj = { [key: string]: Depth1 }
type Depth1 = { [key: string]: string | Depth2 }
type Depth2 = { [key: string]: string }

const mirror = (obj: Obj | Depth1): Obj =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? key : mirror(value),
    }),
    {}
  )

export default mirror(fr)
