import test from 'ava'
import Knex from 'knex'

test.before(t => {
    t.context.db = Knex({
        client: 'sqlite3',
        connection: {
            filename: './chinook.db'
        },
        useNullAsDefault: true
    })
})

test.after(t => {
    t.context.db.destroy()
})

test('foo', t => {
    t.pass()
})
