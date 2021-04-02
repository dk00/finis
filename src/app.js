import {useState, useEffect} from 'preact/hooks'
import {Switch, Route} from 'wouter-preact'
import {parseCode} from 'taiwan-invoice'

import '../style'
import {
  useRecentInvoices,
  useWinningList,
  saveInvoice,
  saveTemporary,
} from './invoice-data'
import QrCodeReader from './qr-code-reader'
import {NavLink} from './routing'
import {getEditionName} from './format'
import matchNumber from './match-number'

const RecentNumberList = () => {
  const invoices = useRecentInvoices()
  const winningList = useWinningList()

  return (
    <div className="recent-number-list">
      {invoices.length <= 0 && 'empty'}
      {invoices.map(item => {
        const result = winningList && matchNumber(winningList, item)
        return (
          <div key={item.serial} className={result?.type}>
            {item.serial}
          </div>
        )
      })}
    </div>
  )
}

const InputTail3 = ({onData}) => {
  const winningList = useWinningList()
  const [date, setDate] = useState(winningList?.[0].startDate)
  const [number, setNumber] = useState('')
  useEffect(() => {
    if (winningList?.length > 0) {
      setDate(winningList[0].startDate)
    }
  }, [winningList])

  return (
    winningList && (
      <div className="number-input">
        <div className="select">
          {winningList?.map(edition => (
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
              onData({
                date,
                serial: next.slice(0, 3),
              })
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

const App = () => (
  <div className="main">
    <Switch>
      <Route path="/saved">Coming soon</Route>
      <Route path="/num-input">
        <InputTail3 onData={saveTemporary} />
        <RecentNumberList />
      </Route>
      <Route>
        <div className="reader">
          <QrCodeReader
            onData={data => {
              saveInvoice(parseCode(data))
            }}
          />
        </div>
        <RecentNumberList />
      </Route>
    </Switch>
    <nav>
      <NavLink href="/">📷</NavLink>
      <NavLink href="/num-input">🔢</NavLink>
      <NavLink href="/saved">💾</NavLink>
    </nav>
  </div>
)

export default App
