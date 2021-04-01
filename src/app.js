import {useState} from 'preact/hooks'
import {Switch, Route} from 'wouter-preact'
import {parseCode} from 'taiwan-invoice'

import '../style'
import {useRecentNumbers, saveInvoice, saveTemporary} from './invoice-data'
import QrCodeReader from './qr-code-reader'
import {NavLink} from './routing'

const RecentNumberList = () => {
  const numbers = useRecentNumbers()

  return (
    <div className="recent-number-list">
      {numbers.length <= 0 && "empty"}
      {numbers.map(number => (
        <div key={number}>{number}</div>
      ))}
    </div>
  )
}

const InputTail3 = ({onData}) => {
  const [number, setNumber] = useState('')

  return (
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
          onData(next.slice(0, 3))
        }
        if (next.length <= 3) {
          setNumber(next)
        } else {
          setNumber(next.slice(3))
        }
      }}
    />
  )
}

const App = () => (
  <div className="main">
    <Switch>
      <Route path="/saved">Coming soon</Route>
      <Route path="/num-input">
        <InputTail3
          onData={saveTemporary}
        />
        <RecentNumberList />
      </Route>
      <Route>
        <div>
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
