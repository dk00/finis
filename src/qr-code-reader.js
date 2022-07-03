import {useRef, useEffect} from 'preact/hooks'

import {captureImage, nextCamera} from './user-media'

const messageSW = (sw, data) =>
  new Promise(resolve => {
    const channel = new MessageChannel()
    sw.postMessage(data, [channel.port2])
    channel.port1.onmessage = event => {
      resolve(event.data)
    }
  })

const startReadLoop = ({video, cameraIndex, onData}) => {
  const cameraOp = nextCamera(video, {index: cameraIndex})
  let nextTimerId
  const readNext = async () => {
    if (video.videoHeight > 0) {
      // TODO clip left
      const {width, height, getImageData} = captureImage(video)
      const result = await messageSW(navigator.serviceWorker.controller, {
        type: 'read-qr-code',
        payload: getImageData(0, 0, width / 2, height),
      })
      onData(result)
    }
    nextTimerId = setTimeout(readNext, 50)
  }
  readNext()

  return () => {
    cameraOp.then(stop => stop())
    clearTimeout(nextTimerId)
  }
}

const QrCodeReader = ({cameraIndex, onData}) => {
  const videoRef = useRef()
  useEffect(
    () =>
      startReadLoop({
        video: videoRef.current,
        cameraIndex,
        onData,
      }),
    [cameraIndex]
  )

  return <video ref={videoRef} autoPlay playsInline />
}

export default QrCodeReader
