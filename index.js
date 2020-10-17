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
 * @param {ParamsFunction} pPred params
 * @param {ReaderType<ParamsFunction, QueryBuilder>} qbR
 * @param {ReaderType<QueryBuilder, FutureInstance>} fR
 */
const Iodio = (pPred, qbR, fR) => {
    const qbCollapse = () => qbR.run(pPred({}))

    const collapse = () => fR.run(qbCollapse())

    const promise = () => F.promise(collapse())

    const chain = pred => pred(pPred, qbR, fR)

    const qMap = pred =>
        Iodio.of(
            pPred,
            qbR.flatMap(qb => Reader(p => pred(qb, p))),
            fR
        )

    const map = pred =>
        Iodio.of(
            pPred,
            qbR,
            fR.map(f => f.pipe(F.map(pred)))
        )

    const pipe = pred =>
        Iodio.of(
            pPred,
            qbR,
            fR.map(f => f.pipe(pred))
        )

    const ap = predI =>
        predI.chain((_, __, predfR) =>
            Iodio.of(
                pPred,
                qbR,
                fR.chain(valueF => predfR.map(predF => F.ap(valueF)(predF)))
            )
        )

    const bimap = (qPred, fPred) =>
        Iodio.of(
            pPred,
            qbR.flatMap(qb => Reader(p => qPred(qb, p))),
            fR.map(f => f.pipe(F.map(fPred)))
        )

    const pMap = pred => Iodio.of(p => pred(pPred(p)), qbR, fR)

    const fork = left => right => collapse().pipe(F.fork(left)(right))

    const toString = () =>
        'Iodio:\n    ' +
        '[' +
        JSON.stringify(pPred({})) +
        ']\n    [' +
        qbCollapse().toString() +
        ']\n    [' +
        collapse().toString() +
        ']'

    const first = () => promise().then(r => r && (Array.isArray(r) ? r[0] : r))

    return {
        pMap,
        qMap,
        map,
        pipe,
        ap,
        chain,
        bimap,
        fork,
        promise,
        toString,
        first,
        // Fantay Land Interface
        'fantasy-land/map': map,
        'fantasy-land/ap': ap,
        'fantasy-land/chain': chain,
        'fantasy-land/bimap': bimap
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
