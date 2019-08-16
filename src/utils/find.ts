type P = { denom: string }
export default <T>(array: (T & P)[]) => (denom: string): T | undefined =>
  Array.isArray(array) ? array.find(o => o.denom === denom) : undefined
