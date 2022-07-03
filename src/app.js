import {useState, useEffect} from 'preact/hooks'
import {Switch, Route} from 'wouter-preact'
import {parseCode} from 'taiwan-invoice'

import '../style'
import {useRecentInvoices, useWinningList, saveInvoice} from './invoice-data'
import QrCodeReader from './qr-code-reader'
import {NavLink} from './routing'
import matchNumber from './match-number'
import KeyIn from './key-in'

const InvoiceItem = ({matched, snap, data = {}}) => (
  <div className={`invoice-item ${matched.type}`}>
    {snap ? (
      <img src={snap} />
    ) : (
      <div className="invoice-icon-placeholder"></div>
    )}
    <div className="content">{data.serial}</div>
    <div className="total">${data.total}</div>
  </div>
)

const tryParseCode = value => {
  try {
    return parseCode(value)
  } catch (e) {
    return {}
  }
}

const handleCode = ({rawValue, boundingBox}, lotteryList, feedback) => {
  const invoiceData = tryParseCode(rawValue)
  if (/[A-Z]{2}\d{8}/.test(invoiceData.serial)) {
    beep()
    navigator.vibrate([77])
    saveInvoice(invoiceData)
    // TODO check number match & feedback
    return {...invoiceData, boundingBox}
  }
}

const RecentNumberList = () => {
  const invoices = useRecentInvoices()
  const lotteryList = useWinningList()
  const [inputState, setInputState] = useState({})
  const [readerResult, setReaderResult] = useState({})
  const nextReaderCamera = () =>
    setInputState(current => ({
      open: 'reader',
      cameraIndex: (current.cameraIndex ?? -1) + 1,
    }))
  const dismiss = () => {
    setInputState({open: false, cameraIndex: -1})
    setReaderResult({})
  }
  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        dismiss()
      }
    })
  }, [])

  return (
    <>
      {inputState.open === 'reader' && (
        <div className="code-input reader">
          <QrCodeReader
            cameraIndex={inputState.cameraIndex}
            onData={code => {
              if (code.rawValue) {
                const parsed = handleCode(code, lotteryList)
                if (parsed) {
                  setReaderResult(parsed)
                }
              }
            }}
          />
        </div>
      )}
      {inputState.open === 'reader' && readerResult.serial && (
        <InvoiceItem
          matched={matchNumber(lotteryList, readerResult)}
          data={readerResult}
        />
      )}
      <div className="recent-number-list">
        {invoices.length <= 0 && 'empty'}
        {invoices
          .filter(item => item.serial !== readerResult.serial)
          .map(item => (
            <InvoiceItem
              key={item.serial}
              matched={matchNumber(lotteryList, item)}
              data={item}
            />
          ))}
        <div className="float-actions">
          {inputState.open && (
            <button type="button" onClick={dismiss}>
              ⬅️
            </button>
          )}
          <button type="button" onClick={nextReaderCamera}>
            📷
          </button>
        </div>
      </div>
    </>
  )
}

const App = () => (
  <div className="main">
    <Switch>
      <Route path="/key-in">
        <KeyIn />
      </Route>
      <Route>
        <RecentNumberList />
      </Route>
    </Switch>
    <nav>
      <NavLink href="/">📜</NavLink>
      <NavLink href="/key-in">⌨️</NavLink>
    </nav>
  </div>
)

export default App
