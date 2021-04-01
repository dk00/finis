import useSWR, {mutate} from 'swr'
import {getDB} from './db'

const ref = {
  temporaryItems: []
}

const useSavedInvoices = ({sort = 'date'}) =>
  useSWR(['invoices', sort], async (_, index) => {
    const db = await getDB()
    const result = db.getAllFromIndex('invoices', index)
    db.close()
    return result
  })

const useRecentNumbers = () => {
  const {data: saved = []} = useSavedInvoices({sort: 'created'})
  const {data: temporary = []} = useSWR('temporary-items', () =>
    Promise.resolve(ref.temporaryItems)
  )
  return []
    .concat(saved, temporary)
    .sort((a, b) => (a.created < b.created ? 1 : -1))
    .map(item => item.serial)
}

const saveInvoice = async data => {
  const invoice = {...data, created: new Date().toJSON()}
  const db = await getDB()
  await db.put('invoices', invoice)
  db.close()
  mutate(['invoices', 'date'])
  mutate(['invoices', 'created'])
}

const saveTemporary = number => {
  ref.temporaryItems = [{
    serial: number,
    created: new Date().toJSON(),
  }].concat(ref.temporaryItems)
  mutate('temporary-items')
}

export {useSavedInvoices, useRecentNumbers, saveInvoice, saveTemporary}
