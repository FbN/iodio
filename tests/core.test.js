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
    t.context.u = Iodio.lift(t.context.db, ['Track']).qMap(qb => qb.limit(1))
    t.context.v = Iodio.lift(t.context.db, ['Track']).qMap(qb =>
        qb.offset(3).limit(1)
    )
    t.context.g1 = r => ({
        ...r,
        label: (r.label || '') + r.Name
    })
    t.context.f1 = r => ({
        ...r,
        label: (r.label || '') + ' by ' + r.Composer
    })
    t.context.a = {
        Name: 'Giorgio by Moroder',
        Composer: 'Daft Punk'
    }
    t.context.b = {
        Name: 'Innuendo',
        Composer: 'Queen'
    }
})

test.after(t => {
    t.context.db.destroy()
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

// Functor
test('Functor: identity', async t => {
    const { u } = t.context
    t.deepEqual(await u.map(I).first(), await u.first())
    t.deepEqual(await u['fantasy-land/map'](I).first(), await u.first())
})

test('Functor: composition', async t => {
    const { u, f1: f, g1: g } = t.context
    t.deepEqual(
        await u.map(x => f(g(x))).first(),
        await u
            .map(g)
            .map(f)
            .first()
    )
})

// Apply
test('ap', async t => {
    const { u, f1: f, g1: g } = t.context
    t.is(
        await u.ap(Iodio.resolve(n => `***${n[0].Name}***`)).first(),
        '***For Those About To Rock (We Salute You)***'
    )
})

test('Apply: composition', async t => {
    const { v, f1: f, g1: g } = t.context

    const a = Iodio.resolve(fr => fr.map(f))
    const u = Iodio.resolve(gr => gr.map(g))

    t.is(
        (await v.ap(u.ap(a.map(f => g => x => f(g(x))))).first()).label,
        (
            await v['fantasy-land/ap'](u)
                ['fantasy-land/ap'](a)
                .first()
        ).label
    )
})

test('Applicative: identity', async t => {
    const { v } = t.context
    t.deepEqual(await v.ap(Iodio.resolve(I)).first(), await v.first())
})

test('Applicative: homomorphism', async t => {
    const { v, f1: f, a: x } = t.context
    t.deepEqual(
        await Iodio.resolve(x)
            .ap(Iodio.resolve(f))
            .first(),
        await Iodio.resolve(f(x)).first()
    )
})

test('Applicative: interchange', async t => {
    const { g1: g, a: x } = t.context
    const u = Iodio.resolve(gr => gr.map(g))
    t.deepEqual(
        await Iodio.resolve([x])
            .ap(u)
            .first(),
        await u.ap(Iodio.resolve(f => f([x]))).first()
    )
})

test('Chain: associativity', async t => {
    const { u, g1, f1 } = t.context

    const f = (pF, qbR, fR) =>
        Iodio.of(
            p => ({
                ...pF(),
                Composer: 'Kurt Cobain'
            }),
            qbR.flatMap(qb =>
                Iodio.ask(p => qb.where({ Composer: p.Composer }))
            ),
            fR.map(f => f.pipe(F.map(res => res.map(g1))))
        )

    const g = (pF, qbR, fR) =>
        Iodio.of(
            p => ({
                ...pF(),
                AlbumId: 164
            }),
            qbR.flatMap(qb => Iodio.ask(p => qb.where({ AlbumId: p.AlbumId }))),
            fR.map(f => f.pipe(F.map(res => res.map(f1))))
        )

    t.deepEqual(
        await u
            .chain(f)
            .chain(g)
            .first(),
        await u.chain((pF, qbR, fR) => f(pF, qbR, fR).chain(g)).first()
    )
})

test('Monad: left identity', t => {
    const { x, f } = t.context

    t.is(
        Iodio(...x)
            ['fantasy-land/chain'](f)
            .toString(),
        f(...x).toString()
    )
})

test('Monad: right identity', t => {
    const { x } = t.context
    t.is(
        Iodio(...x)
            ['fantasy-land/chain'](Iodio.of)
            .toString(),
        Iodio(...x).toString()
    )
})
