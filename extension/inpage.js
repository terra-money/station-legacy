window.isTerraExtensionAvailable = true

// ---------------------------------------------
// for multiple extension support
// ---------------------------------------------
const TERRA_STATION_INFO = {
  name: 'Terra Station',
  identifier: 'station',
  icon: 'https://assets.terra.money/icon/station-extension/icon.png',
}

if (
  typeof window.terraWallets !== 'undefined' &&
  Array.isArray(window.terraWallets)
) {
  window.terraWallets.push(TERRA_STATION_INFO)
} else {
  window.terraWallets = [TERRA_STATION_INFO]
}
