import test from 'ava'
import Knex from 'knex'
import Iodio from '../index.js'
import * as F from 'fluture'

test.before(t => {
    t.context.db = Knex({
        client: 'sqlite3',
        connection: {
            filename: 'tests/chinook.sqlite'
        },
        useNullAsDefault: true
    })
    t.context.x = Iodio._initFromQb(t.context.db, ['tracks'])
    t.context.f = (pF, qbR, fR) =>
        Iodio.of(
            p => ({
                ...pF(),
                Name: 'Smells Like Teen Spirit'
            }),
            qbR.map(qb => qb.where({ Name: 'Nirvana' })),
            fR.map(f => f.pipe(F.map(r => r.Name)))
        )
    t.context.g = (pF, qbR, fR) =>
        Iodio.of(
            p => ({
                ...pF(),
                Name: 'Go Down'
            }),
            qbR.map(qb => qb.where({ Name: 'AC/DC' })),
            fR.map(f => f.pipe(F.map(r => r.Composer)))
        )
})

test.after(t => {
    t.context.db.destroy()
})

test('left identity', t => {
    const { x, f } = t.context

    t.is(
        Iodio(...x)
            .chain(f)
            .toString(),
        f(...x).toString()
    )
})

test('right identity', t => {
    const { x } = t.context
    t.is(
        Iodio(...x)
            .chain(Iodio.of)
            .toString(),
        Iodio(...x).toString()
    )
})

test('associativity', t => {
    const { x, f, g } = t.context
    t.is(
        Iodio(...x)
            .chain(g)
            .chain(f)
            .toString(),
        Iodio(...x)
            .chain((...args) => g(...args).chain(f))
            .toString()
    )
})

test('query dotted', async t => {
    const { db } = t.context

    const query = Iodio.lift(db, ['Track'])
        .qMap(qb => qb.where({ Composer: 'Nirvana' }))
        .qMap(qb => qb.limit(2))
        .map(rows => rows.map(track => track.Name))

    const value = await query.promise()
    t.deepEqual(value, ['Aneurysm', 'Smells Like Teen Spirit'])
})

test('query by params', async t => {
    const { db } = t.context

    const query = Iodio.lift(db, ['Track'])
        .qMap((qb, { Composer }) => qb.where({ Composer }))
        .qMap(qb => qb.limit(2))
        .map(rows => rows.map(track => track.Name))
        .pMap(() => ({
            Composer: 'O. Osbourne, R. Daisley, R. Rhoads'
        }))

    const value = await query.promise()
    t.deepEqual(value, ["I Don't Know", 'Crazy Train'])
})
