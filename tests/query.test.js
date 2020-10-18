import test from 'ava'
import Knex from 'knex'
import Iodio from '../index.js'
import * as F from 'fluture'

const I = a => a

test.before(t => {
    t.context.db = Knex({
        client: 'sqlite3',
        connection: {
            filename: 'tests/chinook.sqlite'
        },
        useNullAsDefault: true
    })
    t.context.u = Iodio.lift(t.context.db, ['Track']).qMap(qb => qb.limit(100))
})

test.after(t => {
    t.context.db.destroy()
})

test('merge', async t => {
    const { u, g1, f1 } = t.context
    let count = 0
    const qbCounter = qb => {
        const then = qb.then
        qb.then = (...args) => {
            count++
            return then.apply(qb, args)
        }
        return qb
    }

    const byComposer = u
        .qMap((qb, p) => qb.where({ Composer: p.Composer }).limit(2))
        .qMap(qbCounter)

    const kobain = byComposer.pMap(() => ({
        Composer: 'Kurt Cobain'
    }))

    const redHotPepper = byComposer.pMap(() => ({
        Composer: 'Red Hot Chili Peppers'
    }))

    const res = await Iodio.merge([kobain, redHotPepper])(
        async (kobainP, redP) => {
            return kobainP
        }
    ).promise()

    t.deepEqual(res, [
        {
            TrackId: 1986,
            Name: 'Intro',
            AlbumId: 163,
            MediaTypeId: 1,
            GenreId: 1,
            Composer: 'Kurt Cobain',
            Milliseconds: 52218,
            Bytes: 1688527,
            UnitPrice: 0.99
        },
        {
            TrackId: 1987,
            Name: 'School',
            AlbumId: 163,
            MediaTypeId: 1,
            GenreId: 1,
            Composer: 'Kurt Cobain',
            Milliseconds: 160235,
            Bytes: 5234885,
            UnitPrice: 0.99
        }
    ])

    t.is(count, 1)

    const res2 = await Iodio.merge([
        kobain,
        redHotPepper
    ])(async (kobainP, redP) => [await redP, await kobainP]).promise()

    t.is(count, 3)
})
