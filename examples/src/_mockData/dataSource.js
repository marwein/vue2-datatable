const Random = require('mockjs').Random
import uniq from 'lodash/uniq'
import without from 'lodash/without'

const total = 120 // how many rows to generate
const getRandomUid = () => Random.integer(1, total)

const users = []
for (let i = 1; i <= total; i++) {
  users.push({
    uid: i,
    name: Random.name(),
    age: Random.integer(0, 100),
    email: Random.email(),
    friends: without(
      uniq(Array(getRandomUid()).fill().map(() => getRandomUid())),
      i // exclude `myself`
    ),
    country: Random.pick(
      ['US', 'UK', 'China', 'Russia', 'Germany', 'France', 'Japan']
    ),
    lang: Random.pick(
      ['English', 'Chinese', 'Russian', 'German', 'French', 'Japanese']
    ),
    programLang: Random.pick(
      ['C', 'C++', 'Java', 'C#', 'Python', 'Ruby', 'PHP', 'JavaScript', 'Go']
    ),
    ip: Random.ip(),
    color: Random.color(),
    createTime: +new Date(Random.datetime('yyyy/MM/dd HH:mm:ss')) // to timestamp
  })
}

export default users
