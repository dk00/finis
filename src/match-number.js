const getMatchedLength = (a, b) =>
  Array.from('x' + a)
    .reverse()
    .findIndex((digit, index) => digit !== b[b.length - index - 1])

const matchNumber = (winningList, invoice) => {
  if (invoice.date > winningList[0].endDate) {
    return {type: 'future'}
  }
  if (invoice.date < winningList[1].startDate) {
    return {type: 'expired'}
  }
  const {numbers} = winningList.find(
    edition =>
      edition.startDate <= invoice.date && invoice.date < edition.endDate
  )
  const matched = numbers
    .map((number, index) => {
      const matchedLength = getMatchedLength(number, invoice.serial)
      console.log(number, invoice.serial, matchedLength)
      return (
        matchedLength >= 3 && {
          type:
            index > 0
              ? 'winning'
              : matchedLength === number.length
              ? 'grand'
              : 'maybe-grand',
          matchedLength,
        }
      )
    })
    .find(Boolean)
  return matched || {type: 'none'}
}

export default matchNumber
