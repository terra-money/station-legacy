const BadgeColors: { [key: string]: string } = {
  deposit: 'badge-success',
  voting: 'badge-info',
  passed: 'badge-primary',
  rejected: 'badge-danger',
}

export const getBadgeColor = (status: string) =>
  BadgeColors[status.toLowerCase()]
