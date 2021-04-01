import {useRef, useEffect} from 'preact/hooks'

import {createCameraStream, captureImage} from './user-media'

const messageSW = (sw, data) =>
  new Promise(resolve => {
    const channel = new MessageChannel()
    sw.postMessage(data, [channel.port2])
    channel.port1.onmessage = event => {
      resolve(event.data)
    }
  })

const startReaderLoop = ({video, onData}) => {
  let state = 'active'
  const readNext = async () => {
    const {width, height, getImageData} = captureImage(video)
    const result = await messageSW(navigator.serviceWorker.controller, {
      type: 'read-qr-code',
      payload: getImageData(0, 0, width / 2, height),
    })
    onData(result)
    setTimeout(() => {
      if (state === 'active') {
        readNext()
      }
    }, 50)
  }
  readNext()

  return () => {state = 'stopped'}
}

const QrCodeReader = ({onData}) => {
  const videoRef = useRef()
  useEffect(() => {
    const loadStream = createCameraStream({
      video: videoRef.current,
    })
    const stopLoop = startReaderLoop({
      video: videoRef.current,
      onData,
    })

    return () => {
      stopLoop()
      loadStream.then(stream => stream.stop())
    }
  }, [])

  return <video ref={videoRef} autoPlay />
}

export default QrCodeReader
