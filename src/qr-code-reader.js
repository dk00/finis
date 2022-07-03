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

const WorkerBarcoderDetector = function () {
  this.detect = async video => {
    const {width, height, getImageData} = captureImage(video)
    const {data, location} = await messageSW(
      navigator.serviceWorker.controller,
      {
        type: 'read-qr-code',
        payload: getImageData(0, 0, width / 2, height),
      }
    )
    return {rawValue: data, location}
  }
}

const startReadLoop = ({video, cameraIndex, onData}) => {
  const cameraOp = nextCamera(video, {index: cameraIndex})
  let nextTimerId, lastResult
  const detector = new BarcodeDetector({formats: ['qr_code']})
  const readNext = async () => {
    if (video.videoHeight > 0) {
      // TODO clip left
      const result = await detector.detect(video)
      if (result.length > 0 && lastResult !== result[0].rawValue) {
        lastResult = result[0].rawValue
        onData(result[0])
      }
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
