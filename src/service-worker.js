import {precacheAndRoute, createHandlerBoundToURL} from 'workbox-precaching'
import {NavigationRoute, registerRoute} from 'workbox-routing'

const precacheManifest = [].concat(
  self.__WB_MANIFEST,
)

precacheAndRoute(precacheManifest)
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

importScripts('https://unpkg.com/jsqr@1.3.1/dist/jsQR.js')

self.addEventListener('message', ({data: {type, payload}, ports: [client]}) => {
  if (type === 'read-qr-code') {
    client.postMessage(
      jsQR(payload.data, payload.width, payload.height)
    )
  }
})
