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

    const promise = () => F.promise(collapse())

    const chain = pred => pred(pF, qbR, fR)

    const map = pred =>
        Iodio.of(
            pF,
            qbR,
            fR.map(f => f.pipe(F.map(pred)))
        )

    const pipe = pred =>
        Iodio.of(
            pF,
            qbR,
            fR.map(f => f.pipe(pred))
        )

    const ap = predI =>
        predI.chain((_, __, predfR) =>
            Iodio.of(
                pF,
                qbR,
                fR.chain(valueF => predfR.map(predF => F.ap(valueF)(predF)))
            )
        )

    return {
        pMap: pred => Iodio.of(p => pred(pF(p)), qbR, fR),

        qMap: pred =>
            Iodio.of(
                pF,
                qbR.flatMap(qb => Reader(p => pred(qb, p))),
                fR
            ),

        map,

        pipe,

        ap,

        chain,

        fork: left => right => collapse().pipe(F.fork(left)(right)),

        promise,

        toString: () =>
            'Iodio:\n    ' +
            '[' +
            JSON.stringify(pF({})) +
            ']\n    [' +
            qbCollapse().toString() +
            ']\n    [' +
            collapse().toString() +
            ']',

        first: () => promise().then(r => r && (Array.isArray(r) ? r[0] : r)),

        // Fantay Land Interface
        'fantasy-land/map': map,
        'fantasy-land/ap': ap,
        'fantasy-land/chain': chain
    }
}

/**
 * @return {[typeof I, ReaderType<ParamsFunction, QueryBuilder>, ReaderType<QueryBuilder, FutureInstance>]}      [description]
 */
function initFromQb (db, args) {
    return [I, Reader(p => db(...args)), Reader(qb => F.attemptP(() => qb))]
}

const resolve = v =>
    Iodio(
        I,
        Reader(I),
        Reader(_ => F.resolve(v))
    )

Iodio.of = Iodio

Iodio.lift = (db, args) => Iodio(...initFromQb(db, args))

Iodio._initFromQb = initFromQb

Iodio.resolve = resolve

Iodio['fantasy-land/of'] = resolve

Iodio.ask = Reader

export default Iodio
