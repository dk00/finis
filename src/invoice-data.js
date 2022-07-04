import useSWR, {mutate} from 'swr'
import {getDB} from './db'

const ref = {
  temporaryItems: [],
}

const useSavedInvoices = ({sort = 'date'}) =>
  useSWR(['invoices', sort], async (_, index) => {
    const db = await getDB()
    const result = db.getAllFromIndex('invoices', index)
    db.close()
    return result
  })

const useRecentInvoices = () => {
  const {data: saved = []} = useSavedInvoices({sort: 'date'})
  const {data: temporary = []} = useSWR('temporary-items', () =>
    Promise.resolve(ref.temporaryItems)
  )
  return []
    .concat(saved, temporary)
    .sort((a, b) => (a.created > b.created ? -1 : 1))
}

const saveInvoice = async data => {
  const invoice = {...data, created: new Date().toJSON()}
  const db = await getDB()
  await db.put('invoices', invoice)
  db.close()
  mutate(['invoices', 'date'])
  mutate(['invoices', 'created'])
}

const saveTemporary = invoice => {
  ref.temporaryItems = [{...invoice, created: new Date().toJSON()}].concat(
    ref.temporaryItems
  )
  mutate('temporary-items')
}

const useWinningList = () =>
  useSWR('https://taiwan-receipt-lottery.netlify.app/latest.json', url =>
    fetch(url).then(res => res.json())
  ).data

export {
  useSavedInvoices,
  useRecentInvoices,
  saveInvoice,
  saveTemporary,
  useWinningList,
}
