import moment from 'moment'
import orderBy from 'lodash/orderBy'
import users from './dataSource'
const typeOf = o => Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
const purify = o => JSON.parse(JSON.stringify(o)) // purify data

/**
 * mockData - simulate Ajax request and respond
 * @param   {Object} query
 * @resolve {Object}
 */
export default function mockData(query) {
  query = purify(query)
  const { limit = 10, offset = 0, sort = '', order = '' } = query

  let rows = users;

  // custom query fields
  ['uid', 'name', 'email', 'country', 'lang', 'programLang'].forEach(field => {
    switch (typeOf(query[field])) {
      case 'array':
        rows = rows.filter(row => query[field].includes(row[field]))
        break
      case 'string':
        rows = rows.filter(row => row[field].toLowerCase().includes(query[field].toLowerCase()))
        break
      default:
        // nothing to do
        break
    }
  })

  if (sort) rows = orderBy(rows, sort, order)

  const res = {
    rows: rows.slice(offset, offset + limit),
    total: rows.length,
    summary: {
      name: rows.length,
      age: rows.length && ~~(rows.map(({ age }) => age).reduce((sum, cur) => sum + cur) / rows.length) // average age
    }
  }

  const consoleGroupName = 'Mock data - ' + moment().format('YYYY-MM-DD HH:mm:ss')
  setTimeout(() => { // avoid blocking the main thread
    console.group(consoleGroupName)
    console.info('Receive:', query)
    console.info('Respond:', res)
    console.groupEnd(consoleGroupName)
  }, 0)
  return Promise.resolve(purify(res))
}
