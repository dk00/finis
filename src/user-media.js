const captureImage = video => {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')
  context.drawImage(video, 0, 0)

  return {
    width: canvas.width,
    height: canvas.height,
    getImageData: (...args) => context.getImageData(...args),
  }
}

const createCameraStream = async ({video}) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {facingMode: 'environment', focusMode: 'continuous'},
  })
  video.srcObject = stream

  return {
    stop: () => stream.getTracks().forEach(track => track.stop()),
  }
}

export {createCameraStream, captureImage}
