export default Iodio;
export type FutureInstance = F.FutureInstance<any, any>;
export type ReaderType<e, a> = Monet.Reader<e, a>;
export type ParamsFunction = (p: object) => object;
export type QueryBuilder = import("knex").QueryBuilder<any, any>;
/**
 * @param {ParamsFunction} pPred params
 * @param {ReaderType<ParamsFunction, QueryBuilder>} qbR
 * @param {ReaderType<QueryBuilder, FutureInstance>} fR
 */
declare const Iodio: {
    (pPred: ParamsFunction, qbR: ReaderType<ParamsFunction, QueryBuilder>, fR: ReaderType<QueryBuilder, F.FutureInstance<any, any>>): {
        pMap: (pred: any) => any;
        qMap: (pred: any) => any;
        map: (pred: any) => any;
        pipe: (pred: any) => any;
        ap: (predI: any) => any;
        chain: (pred: any) => any;
        bimap: (qPred: any, fPred: any) => any;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: any) => any;
        'fantasy-land/ap': (predI: any) => any;
        'fantasy-land/chain': (pred: any) => any;
        'fantasy-land/bimap': (qPred: any, fPred: any) => any;
    };
    of: any;
    lift(db: any, args: any): {
        pMap: (pred: any) => any;
        qMap: (pred: any) => any;
        map: (pred: any) => any;
        pipe: (pred: any) => any;
        ap: (predI: any) => any;
        chain: (pred: any) => any;
        bimap: (qPred: any, fPred: any) => any;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: any) => any;
        'fantasy-land/ap': (predI: any) => any;
        'fantasy-land/chain': (pred: any) => any;
        'fantasy-land/bimap': (qPred: any, fPred: any) => any;
    };
    _initFromQb: typeof initFromQb;
    resolve: (v: any) => {
        pMap: (pred: any) => any;
        qMap: (pred: any) => any;
        map: (pred: any) => any;
        pipe: (pred: any) => any;
        ap: (predI: any) => any;
        chain: (pred: any) => any;
        bimap: (qPred: any, fPred: any) => any;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: any) => any;
        'fantasy-land/ap': (predI: any) => any;
        'fantasy-land/chain': (pred: any) => any;
        'fantasy-land/bimap': (qPred: any, fPred: any) => any;
    };
    'fantasy-land/of': (v: any) => {
        pMap: (pred: any) => any;
        qMap: (pred: any) => any;
        map: (pred: any) => any;
        pipe: (pred: any) => any;
        ap: (predI: any) => any;
        chain: (pred: any) => any;
        bimap: (qPred: any, fPred: any) => any;
        fork: (left: any) => (right: any) => F.Cancel;
        promise: () => Promise<any>;
        toString: () => string;
        first: () => Promise<any>;
        'fantasy-land/map': (pred: any) => any;
        'fantasy-land/ap': (predI: any) => any;
        'fantasy-land/chain': (pred: any) => any;
        'fantasy-land/bimap': (qPred: any, fPred: any) => any;
    };
    ask: Monet.IReaderStatic;
};
import * as F from "fluture";
import Monet from "monet";
/**
 * @return {[typeof I, ReaderType<ParamsFunction, QueryBuilder>, ReaderType<QueryBuilder, FutureInstance>]}      [description]
 */
declare function initFromQb(db: any, args: any): [typeof I, ReaderType<ParamsFunction, QueryBuilder>, ReaderType<QueryBuilder, F.FutureInstance<any, any>>];
/** @typedef { import("fluture").FutureInstance} FutureInstance */
/**
 * @template e
 * @template a
 * @typedef { import("monet").Reader<e, a> } ReaderType
 **/
/** @typedef {(p:object) => object} ParamsFunction */
/** @typedef { import("knex").QueryBuilder} QueryBuilder */
declare function I(a: any): any;
