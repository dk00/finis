import {h, render} from 'preact'
import app from './app'

const addSentry = () => {
  const s = document.createElement('script')
  s.src = 'https://browser.sentry-cdn.com/4.6.4/bundle.min.js'
  s.addEventListener('load', () => {
    Sentry.init({
      dsn: 'https://ae873ac970c8413283ee643a68dffa91@sentry.io/1412140',
    })
  })
  document.head.append(s)
}

addSentry()

const renderApp = () => render(h(app), document.querySelector('#root'))

if (module.hot) {
  module.hot.accept('./app', renderApp)
}

renderApp()

if (!module.hot) {
  navigator.serviceWorker?.register('/service-worker.js')
}
