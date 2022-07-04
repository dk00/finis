const createV1 = db => {
  // Create a store of objects
  const store = db.createObjectStore('invoices', {
    // The 'id' property of the object will be the key.
    keyPath: 'serial',
  })
  // Create an index on the 'date' property of the objects.
  store.createIndex('date', 'date', {unique: true})
  store.createIndex('created', 'created')
}

const upgradeV2 = (db, transaction) => {
    const store = transaction.objectStore('invoices')
    store.deleteIndex('date')
    store.createIndex('date', 'date')
}

const getDB = async () => {
  const {openDB} = await import('idb/with-async-ittr.js')
  return openDB('invoices', 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
      switch(oldVersion) {
        case 0:
          console.info('create DB v1')
          createV1(db)
          // intentionally no break here, continues through the rest for latest version DB
        case 1:
          console.info('upgrade DB v2')
          upgradeV2(db, transaction)
      }
    },
  })
}

export {getDB}
