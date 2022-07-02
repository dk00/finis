const getNumberLists = async () => {
  const fetch = require('node-fetch')
  const content = await fetch('https://bluezz.com.tw/invoice_history.php').then(
    res => res.text()
  )

  return content
    .split(/(?=\d\d\d年)/g)
    .slice(1, 3)
    .map(list => {
      const issue = list.match(/\d{3}年.+月/)[0]
      const [, year, month] = issue.match(/(\d{3})年(\d+).+月/)
      const d = new Date(`${1911 + +year}-${month.padStart(2, '0')}-01`)
      const startDate = d.toJSON()
      d.setMonth(+month + 1)
      d.setDate(d.getDate() - 1)
      endDate = d.toJSON()
      return {
        date: issue,
        startDate,
        endDate,
        numbers: list.match(/\d{8}|(?<=\D)\d{3}(?=\D)/g),
      }
    })
}

const main = () =>
  getNumberLists().then(res => console.log(JSON.stringify(res, null, 2)))

main()

module.exports = getNumberLists
