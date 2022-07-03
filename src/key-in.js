import {useState, useEffect} from 'preact/hooks'

import {useWinningList} from './invoice-data'
import {getEditionName} from './format'

const KeyIn = ({onData}) => {
  const lotteryList = useWinningList()
  const [date, setDate] = useState(lotteryList?.[0].startDate)
  const [number, setNumber] = useState('')
  useEffect(() => {
    if (lotteryList?.length > 0) {
      setDate(lotteryList[0].startDate)
    }
  }, [lotteryList])

  return (
    lotteryList && (
      <div className="code-input key-in">
        <div className="select">
          {lotteryList?.map(edition => (
            <button
              type="button"
              className={date === edition.startDate && 'selected'}
              onClick={() => setDate(edition.startDate)}
            >
              {getEditionName(edition)}
            </button>
          ))}
        </div>
        <input
          // For a numeric keyboard: https://stackoverflow.com/a/31619707/4578017
          type="tel"
          pattern="[0-9]*"
          placeholder=""
          autoComplete="off"
          value={number}
          onInput={event => {
            const next = event.target.value
            if (next.length === 3) {
              onData({date, serial: next.slice(0, 3)})
            }
            if (next.length <= 3) {
              setNumber(next)
            } else {
              setNumber(next.slice(3))
            }
          }}
        />
      </div>
    )
  )
}

export default KeyIn
