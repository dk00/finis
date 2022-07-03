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

const ref = {
  deviceId: localStorage.getItem('last-camera-id')
}

const getDeviceId = stream => stream.getTracks()[0].getSettings().deviceId

const nextCamera = async (video, {index} = {}) => {
  const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
    device => device.deviceId && device.kind === 'videoinput'
  )
  if (index > 0) {
    ref.deviceId = devices[index % devices.length]?.deviceId
  }
  await ref.request
  if (video.srcObject) {
    const tracks = video.srcObject?.getVideoTracks?.() || []
    tracks.forEach(track => track.stop())
  }
  ref.request = navigator.mediaDevices.getUserMedia({
    video: ref.deviceId
      ? {focusMode: 'continuous', deviceId: ref.deviceId}
      : {focusMode: 'continuous', facingMode: 'environment'},
  })
  video.srcObject = await ref.request
  console.log('using camera', getDeviceId(video.srcObject))
  localStorage.setItem('last-camera-id', getDeviceId(video.srcObject))
  return () => video.srcObject.getTracks().forEach(track => track.stop())
}

export {nextCamera, captureImage}
