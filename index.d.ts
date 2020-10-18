export default Iodio;
export type FutureInstance<left, right> = F.FutureInstance<left, right>;
export type ReaderType<e, a> = Monet.Reader<e, a>;
export type QueryBuilder<record, result> = import("knex").QueryBuilder<record, result>;
export type ParamsFunction = (p: object) => object;
export type QueryBuilderT<T> = import("knex").QueryBuilder<any, T[]>;
export type FutureInstanceT<T> = F.FutureInstance<any, T extends Function ? T : T[]>;
export type FutureInstanceArrayT<T> = F.FutureInstance<any, T[]>;
export type QueryPredicate<result> = (qb: import("knex").QueryBuilder<any, result>, p?: object) => import("knex").QueryBuilder<any, result>;
export type ResultPredicate<a, b> = (f: F.FutureInstance<any, a>) => F.FutureInstance<any, b>;
export type IodioTuple<T> = [(a: any) => any, Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T[]>>];
export type IodioInstance<T> = {
    pMap: (pred: ParamsFunction) => object;
    qMap: (pred: (qb: import("knex").QueryBuilder<any, T>, p?: object) => import("knex").QueryBuilder<any, T>) => any;
    map: (pred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, T>) => any;
    pipe: (pred: F.FutureInstance<any, T extends Function ? T : T[]>) => IodioInstance<any>;
    ap: (predI: IodioInstance<Function>) => IodioInstance<any>;
    chain: (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T extends Function ? T : T[]>>) => IodioInstance<any>;
    bimap: (qPred: (qb: import("knex").QueryBuilder<any, T>, p?: object) => import("knex").QueryBuilder<any, T>, fPred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, any>) => IodioInstance<any>;
    fork: (left: any) => (right: any) => F.Cancel;
    promise: () => Promise<any>;
    toString: () => string;
    first: () => Promise<any>;
    'fantasy-land/map': (pred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, T>) => any;
    'fantasy-land/ap': (predI: IodioInstance<Function>) => IodioInstance<any>;
    'fantasy-land/chain': (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T extends Function ? T : T[]>>) => IodioInstance<any>;
    'fantasy-land/bimap': (qPred: (qb: import("knex").QueryBuilder<any, T>, p?: object) => import("knex").QueryBuilder<any, T>, fPred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, any>) => IodioInstance<any>;
};
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
declare const Iodio: {
    <T>(pPred: ParamsFunction, qbR: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, fR: Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T extends Function ? T : T[]>>): {
        pMap: (pred: ParamsFunction) => object;
        qMap: (pred: (qb: import("knex").QueryBuilder<any, T>, p?: object) => import("knex").QueryBuilder<any, T>) => any;
        map: (pred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, T>) => any;
        pipe: (pred: F.FutureInstance<any, T extends Function ? T : T[]>) => IodioInstance<any>;
        ap: (predI: IodioInstance<Function>) => IodioInstance<any>;
        chain: (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T extends Function ? T : T[]>>) => IodioInstance<any>;
        bimap: (qPred: (qb: import("knex").QueryBuilder<any, T>, p?: object) => import("knex").QueryBuilder<any, T>, fPred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, any>) => IodioInstance<any>;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, T>) => any;
        'fantasy-land/ap': (predI: IodioInstance<Function>) => IodioInstance<any>;
        'fantasy-land/chain': (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T extends Function ? T : T[]>>) => IodioInstance<any>;
        'fantasy-land/bimap': (qPred: (qb: import("knex").QueryBuilder<any, T>, p?: object) => import("knex").QueryBuilder<any, T>, fPred: (f: F.FutureInstance<any, T>) => F.FutureInstance<any, any>) => IodioInstance<any>;
    };
    of: any;
    lift(db: any, args: any): {
        pMap: (pred: ParamsFunction) => object;
        qMap: (pred: (qb: import("knex").QueryBuilder<any, any>, p?: object) => import("knex").QueryBuilder<any, any>) => any;
        map: (pred: (f: F.FutureInstance<any, any>) => F.FutureInstance<any, any>) => any;
        pipe: (pred: F.FutureInstance<any, any>) => IodioInstance<any>;
        ap: (predI: IodioInstance<Function>) => IodioInstance<any>;
        chain: (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, any[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, any[]>, F.FutureInstance<any, any>>) => IodioInstance<any>;
        bimap: (qPred: (qb: import("knex").QueryBuilder<any, any>, p?: object) => import("knex").QueryBuilder<any, any>, fPred: (f: F.FutureInstance<any, any>) => F.FutureInstance<any, any>) => IodioInstance<any>;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: (f: F.FutureInstance<any, any>) => F.FutureInstance<any, any>) => any;
        'fantasy-land/ap': (predI: IodioInstance<Function>) => IodioInstance<any>;
        'fantasy-land/chain': (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, any[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, any[]>, F.FutureInstance<any, any>>) => IodioInstance<any>;
        'fantasy-land/bimap': (qPred: (qb: import("knex").QueryBuilder<any, any>, p?: object) => import("knex").QueryBuilder<any, any>, fPred: (f: F.FutureInstance<any, any>) => F.FutureInstance<any, any>) => IodioInstance<any>;
    };
    _initFromQb: typeof initFromQb;
    resolve: <T_2>(v: T_2 extends Function ? T_2 : T_2[]) => {
        pMap: (pred: ParamsFunction) => object;
        qMap: (pred: (qb: import("knex").QueryBuilder<any, T_2>, p?: object) => import("knex").QueryBuilder<any, T_2>) => any;
        map: (pred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, T_2>) => any;
        pipe: (pred: F.FutureInstance<any, T_2 extends Function ? T_2 : T_2[]>) => IodioInstance<any>;
        ap: (predI: IodioInstance<Function>) => IodioInstance<any>;
        chain: (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T_2[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T_2[]>, F.FutureInstance<any, T_2 extends Function ? T_2 : T_2[]>>) => IodioInstance<any>;
        bimap: (qPred: (qb: import("knex").QueryBuilder<any, T_2>, p?: object) => import("knex").QueryBuilder<any, T_2>, fPred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, any>) => IodioInstance<any>;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, T_2>) => any;
        'fantasy-land/ap': (predI: IodioInstance<Function>) => IodioInstance<any>;
        'fantasy-land/chain': (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T_2[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T_2[]>, F.FutureInstance<any, T_2 extends Function ? T_2 : T_2[]>>) => IodioInstance<any>;
        'fantasy-land/bimap': (qPred: (qb: import("knex").QueryBuilder<any, T_2>, p?: object) => import("knex").QueryBuilder<any, T_2>, fPred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, any>) => IodioInstance<any>;
    };
    'fantasy-land/of': <T_2>(v: T_2 extends Function ? T_2 : T_2[]) => {
        pMap: (pred: ParamsFunction) => object;
        qMap: (pred: (qb: import("knex").QueryBuilder<any, T_2>, p?: object) => import("knex").QueryBuilder<any, T_2>) => any;
        map: (pred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, T_2>) => any;
        pipe: (pred: F.FutureInstance<any, T_2 extends Function ? T_2 : T_2[]>) => IodioInstance<any>;
        ap: (predI: IodioInstance<Function>) => IodioInstance<any>;
        chain: (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T_2[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T_2[]>, F.FutureInstance<any, T_2 extends Function ? T_2 : T_2[]>>) => IodioInstance<any>;
        bimap: (qPred: (qb: import("knex").QueryBuilder<any, T_2>, p?: object) => import("knex").QueryBuilder<any, T_2>, fPred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, any>) => IodioInstance<any>;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, T_2>) => any;
        'fantasy-land/ap': (predI: IodioInstance<Function>) => IodioInstance<any>;
        'fantasy-land/chain': (a: ParamsFunction, b: Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T_2[]>>, c: Monet.Reader<import("knex").QueryBuilder<any, T_2[]>, F.FutureInstance<any, T_2 extends Function ? T_2 : T_2[]>>) => IodioInstance<any>;
        'fantasy-land/bimap': (qPred: (qb: import("knex").QueryBuilder<any, T_2>, p?: object) => import("knex").QueryBuilder<any, T_2>, fPred: (f: F.FutureInstance<any, T_2>) => F.FutureInstance<any, any>) => IodioInstance<any>;
    };
    ask: Monet.IReaderStatic;
};
import * as F from "fluture";
import Monet from "monet";
/**
 * @template T
 * @return {IodioTuple<T>}
 */
declare function initFromQb<T>(db: any, args: any): [(a: any) => any, Monet.Reader<(p: object) => object, import("knex").QueryBuilder<any, T[]>>, Monet.Reader<import("knex").QueryBuilder<any, T[]>, F.FutureInstance<any, T[]>>];
