import * as F from 'fluture'
import Monet from 'monet'
const { Reader } = Monet
/** @typedef { import("fluture").FutureInstance} FutureInstance */
/**
 * @template e
 * @template a
 * @typedef { import("monet").Reader<e, a> } ReaderType
 **/
/** @typedef {(p:object) => object} ParamsFunction */
/** @typedef { import("knex").QueryBuilder} QueryBuilder */

const I = a => a

/**
 * @param {ParamsFunction} pF params
 * @param {ReaderType<ParamsFunction, QueryBuilder>} qbR
 * @param {ReaderType<QueryBuilder, FutureInstance>} fR
 */
const Iodio = (pF, qbR, fR) => {
    const qbCollapse = () => qbR.run(pF({}))
    const collapse = () => fR.run(qbCollapse())
    return {
        pMap: pred => Iodio.of(p => pred(pF(p)), qbR, fR),

        qMap: pred =>
            Iodio.of(
                pF,
                qbR.flatMap(qb => Reader(p => pred(qb, p))),
                fR
            ),

        map: pred =>
            Iodio.of(
                pF,
                qbR,
                fR.map(f => f.pipe(F.map(pred)))
            ),

        pipe: pred =>
            Iodio.of(
                pF,
                qbR,
                fR.map(f => f.pipe(pred))
            ),

        chain: pred => pred(pF, qbR, fR),

        fork: left => right => collapse().pipe(F.fork(left)(right)),

        promise: () => F.promise(collapse()),

        toString: () =>
            'Iodio:\n    ' +
            '[' +
            JSON.stringify(pF({})) +
            ']\n    [' +
            qbCollapse().toString() +
            ']\n    [' +
            collapse().toString() +
            ']'
    }
}

function initFromQb (db, args) {
    return [I, Reader(p => db(...args)), Reader(qb => F.attemptP(() => qb))]
}

Iodio.of = Iodio

Iodio.lift = (db, args) => Iodio(...initFromQb(db, args))

Iodio.ask = Reader

Iodio._initFromQb = initFromQb

export default Iodio
