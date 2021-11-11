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
  typeof window.terraExtensions !== 'undefined' &&
  Array.isArray(window.terraExtensions)
) {
  window.terraExtensions.push(TERRA_STATION_INFO)
} else {
  window.terraExtensions = [TERRA_STATION_INFO]
}
