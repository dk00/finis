const pad0 = (value, length) =>
  value.toString().padStart(length, '0')

const getEditionName = ({startDate, endDate}) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return `${start.getFullYear() - 1911}-${pad0(start.getMonth() + 1, 2)}, ${end.getFullYear() - 1911}-${pad0(end.getMonth() + 1, 2)}`
}

export {getEditionName}
