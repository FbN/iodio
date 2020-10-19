import Knex from 'knex'
import Iodio from './index.js'

// Init the Knex DB connection config
const db = Knex({
    client: 'sqlite3',
    connection: {
        filename: 'tests/chinook.sqlite'
    },
    useNullAsDefault: true
})

// Construct Iodio object. Lift take DB connection and a params list.
// Params are passed directly to knex: tableName, options={only: boolean}
const q = Iodio.lift(db, ['Track'])

// Then you can start working on your query
// (qb is knew QueryBuilder)
const q2 = q.qMap(qb => qb.limit(3))

// Lets transform the result
// res is the query result list
const q3 = q2.map(res => res.map(row => row.Name + ' by  ' + row.Composer))

// Let's filter by Composer
// qMap second param 'p' is the Iodio params object
const q4 = q3.qMap((qb, p) => qb.where({ Composer: p.Composer }))

// Get a Iodio binded to Composer 'Red Hot Chili Peppers'
const redHot = q4.pMap(() => ({
    Composer: 'Red Hot Chili Peppers'
}))

// Get a Iodio binded to Composer 'Kurt Cobain'
const cobain = q4.pMap(() => ({
    Composer: 'Kurt Cobain'
}))

// I want to work on the result of the two query
// we use async/await as DO Notation
const redHotCobain = Iodio.merge([redHot, cobain])(async (redHot, cobain) => [
    ...(await redHot),
    ...(await cobain)
])

// N.B. no real query is actually executed at this point, it's all lazy
//
// To run all the constructed computations and effects
// we call fork
redHotCobain.fork(console.error)(console.log)
