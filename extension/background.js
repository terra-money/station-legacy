import extension from 'extensionizer'
import PortStream from 'extension-port-stream'

const connectRemote = (remotePort) => {
  if (remotePort.name !== 'TerraStationExtension') {
    return
  }

  const origin = remotePort.sender.origin

  console.log('Station(background): connectRemote', remotePort)
  const portStream = new PortStream(remotePort)

  const sendResponse = (name, payload) => {
    portStream.write({ name, payload })
  }

  portStream.on('data', (data) => {
    console.log('Station(background): portStream.on', data)
    const { type, ...payload } = data

    /* handle sign & post */
    const handleRequest = (key) => {
      const handleChange = (changes, namespace) => {
        // Detects changes in storage and returns responses if there are changes.
        // When the request is successful, it also closes the popup.
        if (namespace === 'local') {
          const { oldValue, newValue } = changes[key] || {}

          if (oldValue && newValue) {
            const changed = newValue.find(
              (post, index) =>
                oldValue[index] &&
                typeof oldValue[index].success === 'undefined' &&
                typeof post.success === 'boolean'
            )

            changed &&
              changed.origin === origin &&
              sendResponse('on' + capitalize(key), changed)

            extension.storage.local.get(
              ['sign', 'post'],
              ({ sign = [], post = [] }) => {
                const getRequest = ({ success }) => typeof success !== 'boolean'
                const nextRequest =
                  sign.some(getRequest) || post.some(getRequest)

                !nextRequest && closePopup()
              }
            )
          }
        }
      }

      const handleGet = (storage) => {
        // Check the storage for any duplicate requests already, place them at the end of the storage, and then open a popup.
        // Then it detects changes in storage. (See code above)
        // TODO: Even if the popup is already open, reactivate the popup
        const list = storage[key] || []

        const alreadyRequested =
          list.findIndex(
            (req) => req.id === payload.id && req.origin === origin
          ) !== -1

        !alreadyRequested &&
          extension.storage.local.set({
            [key]: payload.purgeQueue
              ? [{ ...payload, origin }]
              : [...list, { ...payload, origin }],
          })

        openPopup()
        extension.storage.onChanged.addListener(handleChange)
      }

      extension.storage.local.get([key], handleGet)
    }

    switch (type) {
      case 'info':
        extension.storage.local.get(['network'], ({ network }) => {
          sendResponse('onInfo', network)
        })

        break

      case 'connect':
        const handleChangeConnect = (changes, namespace) => {
          // It is recursive.
          // After referring to a specific value in the storage, perform the function listed below again.
          if (namespace === 'local') {
            extension.storage.local.get(['connect', 'wallet'], handleGetConnect)
          }
        }

        const handleGetConnect = ({
          connect = { request: [], allowed: [] },
          wallet = {},
        }) => {
          // 1. If the address is authorized and the wallet exists
          //    - send back the response and close the popup.
          // 2. If not,
          //    - store the address on the storage and open the popup to request it (only if it is not the requested address).
          const isAllowed = connect.allowed.includes(origin)
          const walletExists = wallet.address
          const alreadyRequested = [
            ...connect.request,
            ...connect.allowed,
          ].includes(origin)

          if (isAllowed && walletExists) {
            sendResponse('onConnect', wallet)
            closePopup()
            extension.storage.onChanged.removeListener(handleChangeConnect)
          } else {
            !alreadyRequested &&
              extension.storage.local.set({
                connect: { ...connect, request: [origin, ...connect.request] },
              })

            openPopup()
            extension.storage.onChanged.addListener(handleChangeConnect)
          }
        }

        extension.storage.local.get(['connect', 'wallet'], handleGetConnect)

        break

      case 'sign':
        handleRequest('sign')
        break

      case 'post':
        handleRequest('post')
        break

      default:
        break
    }
  })
}

extension.runtime.onConnect.addListener(connectRemote)

/* popup */
// TODO: Actions such as transaction rejection if user closes a popup
let tabId = undefined
extension.tabs.onRemoved.addListener(() => (tabId = undefined))

const openPopup = () => {
  const popup = { type: 'popup', focused: true, width: 480, height: 640 }
  !tabId &&
    extension.tabs.create(
      { url: extension.extension.getURL('index.html'), active: false },
      (tab) => {
        tabId = tab.id
        extension.windows.getCurrent((window) => {
          const config = { ...popup, tabId: tab.id, top: window.top }
          extension.windows.create(config)
        })
      }
    )
}

const closePopup = () => {
  tabId && extension.tabs.remove(tabId)
}

/* utils */
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)
