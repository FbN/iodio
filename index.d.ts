export default Iodio;
export type FutureInstance = F.FutureInstance<any, any>;
export type ReaderType<e, a> = Monet.Reader<e, a>;
export type ParamsFunction = (p: object) => object;
export type QueryBuilder = import("knex").QueryBuilder<any, any>;
/**
 * @param {ParamsFunction} pF params
 * @param {ReaderType<ParamsFunction, QueryBuilder>} qbR
 * @param {ReaderType<QueryBuilder, FutureInstance>} fR
 */
declare function Iodio(pF: ParamsFunction, qbR: ReaderType<ParamsFunction, QueryBuilder>, fR: ReaderType<QueryBuilder, F.FutureInstance<any, any>>): {
    pMap: (pred: any) => any;
    qMap: (pred: any) => any;
    map: (pred: any) => any;
    pipe: (pred: any) => any;
    chain: (pred: any) => any;
    fork: (left: any) => (right: any) => F.Cancel;
    toString: () => string;
};
declare namespace Iodio {
    export { Iodio as of };
    export function lift(db: any, args: any): {
        pMap: (pred: any) => any;
        qMap: (pred: any) => any;
        map: (pred: any) => any;
        pipe: (pred: any) => any;
        chain: (pred: any) => any;
        fork: (left: any) => (right: any) => F.Cancel;
        toString: () => string;
    };
    export { initFromQb as _initFromQb };
}
import * as F from "fluture";
import Monet from "monet";
declare function initFromQb(db: any, args: any): (Monet.Reader<any, any> | ((a: any) => any))[];
