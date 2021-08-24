export default (query: string, array?: any[]): string | undefined => {
  const [denom, key] = query.split(':')
  return array?.find((o) => o['denom'] === denom)?.[key]
}
