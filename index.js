import * as F from 'fluture'
import Monet from 'monet'

const { Reader } = Monet

/**
 * @template left
 * @template right
 * @typedef { import("fluture").FutureInstance<left, right>} FutureInstance
 */

/**
 * @template e
 * @template a
 * @typedef { import("monet").Reader<e, a> } ReaderType
 **/

/**
 * @template record
 * @template result
 * @typedef { import("knex").QueryBuilder<record, result>} QueryBuilder
 */

/** @typedef {(p:object) => object} ParamsFunction */

/**
 * @template T
 * @typedef {QueryBuilder<any, Array<T>>} QueryBuilderT
 */

/**
 * @template T
 * @typedef {FutureInstance<any, T extends Function ? T : Array<T>>} FutureInstanceT
 */

/**
 * @template T
 * @typedef {FutureInstance<any, Array<T>>} FutureInstanceArrayT
 */

/**
 * @template result
 * @typedef {(qb: QueryBuilder<any, result>, p?: object) => QueryBuilder<any, result>} QueryPredicate
 */

/**
 * @template a
 * @template b
 * @typedef {(f: FutureInstance<any, a>) => FutureInstance<any, b>} ResultPredicate
 */

/**
 * @template T
 * @typedef {[
 *      typeof I,
 *      ReaderType<ParamsFunction, QueryBuilderT<T>>,
 *      ReaderType<QueryBuilderT<T>, FutureInstanceArrayT<T>>
 * ]} IodioTuple
 */

/**
 * @template T
 * @typedef {{
 *      pMap: (pred: ParamsFunction) => object;
 *      qMap: (pred: QueryPredicate<T>) => IodioInstance<T>;
 *      map: (pred: ResultPredicate<T, T>) => IodioInstance<T>;
 *      pipe: (pred: FutureInstanceT<T>) => IodioInstance<any>;
 *      ap: (predI: IodioInstance<Function>) => IodioInstance<any>;
 *      chain: (
 *          a: ParamsFunction,
 *          b: ReaderType<ParamsFunction, QueryBuilderT<T>>,
 *          c: ReaderType<QueryBuilderT<T>, FutureInstanceT<T>>
 *          ) => IodioInstance<any>;
 *      bimap: (qPred: QueryPredicate<T>, fPred: ResultPredicate<T, any>) => IodioInstance<any>;
 *      fork: (left: any) => (right: any) => F.Cancel;
 *      promise: () => Promise<any>;
 *      toString: () => string;
 *      first: () => Promise<any>;
 *      'fantasy-land/map': (pred: ResultPredicate<T, T>)  => IodioInstance<T>;
 *      'fantasy-land/ap': (predI: IodioInstance<Function>) => IodioInstance<any>;
 *      'fantasy-land/chain': (
 *          a: ParamsFunction,
 *          b: ReaderType<ParamsFunction, QueryBuilderT<T>>,
 *          c: ReaderType<QueryBuilderT<T>, FutureInstanceT<T>>
 *          ) => IodioInstance<any>;
 *      'fantasy-land/bimap': (qPred: QueryPredicate<T>, fPred: ResultPredicate<T, any>) => IodioInstance<any>;
 * }} IodioInstance
 */

const I = a => a

/**
 * @template T
 * @param {ParamsFunction} pPred
 *      Function to reduce actual params map.
 *      Take as input current params map and return the new one.
 *
 * @param {ReaderType<ParamsFunction, QueryBuilderT<T>>} qbR
 *      Reader Monad that wrap a Knex query builder.
 *
 * @param {ReaderType<QueryBuilderT<T>, FutureInstanceT<T>>} fR
 *      Reader Monad that wrap the Fluture instace with querry result.
 * @return {IodioInstance<T>}
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
 * @template T
 * @return {IodioTuple<T>}
 */
function initFromQb (db, args) {
    return [I, Reader(p => db(...args)), Reader(qb => F.attemptP(() => qb))]
}

/**
 * @template T
 * @param  {T extends Function ? T : Array<T>} v
 * @return {IodioInstance<T>}
 */
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
