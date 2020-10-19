[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/FbN/iodio">
    <img src="images/logo.png" alt="IODIO" width="400">
  </a>

  <h3 align="center">Pure Functional Monadic Lazy <strong>Query Builder</strong></h3>

  <p align="center">
    Wraps
    <a href="http://knexjs.org/">
        <img src="http://knexjs.org/assets/images/knex.png" alt="Fluture" height="40" style="vertical-align: baseline"/>
    </a>
  </p>

  <p align="center">
    Powered by
    <a href="https://github.com/fluture-js/Fluture">
        <img src="https://github.com/fluture-js/Fluture/raw/master/logo.png" alt="Fluture" height="40" style="vertical-align: baseline"/>
    </a>
  </p>

  <p align="center">
    <a href="https://github.com/fantasyland/fantasy-land">
        <img src="https://github.com/fantasyland/fantasy-land/raw/master/logo.png" alt="Fluture" height="40" style="vertical-align: baseline"/>
    </a>
    Implements Fantasy Land:<br /><strong>Functor</strong>, <strong>Bifunctor</strong>,
    <strong>Apply</strong>, <strong>Applicative</strong>, <strong>Chain</strong>,
    <strong>Monad</strong>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Usage](#usage)
* [API Documentation](#API)
* [License](#license)
* [Contact](#contact)


<!-- ABOUT THE PROJECT -->
## About The Project

I really love Knex.js Query Builder. It is really easy to set up and use. It's Promise based and offers a clean, fluent way to interact with the Database engine of your choice (Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift).

Some aspects of Knex I like less:

* **Mutable**. Every time you specialize in your query calling some method (.where, .limit, .join, etc.) you are mutating the same instance. This makes it harder to compose your apps.

* **Not Lazy**. Being based on Promise, the query is materially executed the moment you call .then on the builder or try to "await" for the result. You cannot composer your program in a Pure way leaving the actual "impure" query execution as the last step.

So, let's introduce you IODIO. It's a monadic wrapper of a Knex query builder and a Fluture Future that represents the result of the query.
It's lazy and pure, so you can program in advance your computations (query composition and/or result transformation) and run all as the last step.

### Built With
Iodio is implemented in a few lines of code that mix up some good libraries:
* [Knex](http://knexjs.org/)
* [Fluture](https://github.com/fluture-js/Fluture)
* [Monet.js](https://monet.github.io/monet.js/)


<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Add Iodio to your project

  ```sh
  yarn add iodio
  ```

2. If not already in your project add peer dependencies

  ```sh
  yarn add knex
  yarn add fluture
  ```
3. Do not forget your DB connection layer, ex. sqlite3

  ```sh
  yarn add sqlite3
  ```

<!-- USAGE EXAMPLES -->
## Usage

Node.js "Hello World".

```js
import Knex from 'knex'
import Iodio from 'iodio'

// Init the Knex DB connection config
const db = Knex({
    client: 'sqlite3',
    connection: {
        filename: 'tests/chinook.sqlite'
    },
    useNullAsDefault: true
})

// Construct Iodio object. Lift take DB connection and a params list.
// Params are passed directly to knex: tableName, options={only: boolean}
const q = Iodio.lift(db, ['Track'])

// Then you can start working on your query
// (qb is knew QueryBuilder)
const q2 = q.qMap(qb => qb.limit(3))

// Lets transform the result
// res is the query result list
const q3 = q2.map(res => res.map(row => row.Name + ' by  ' + row.Composer))

// Let's filter by Composer
// qMap second param 'p' is the Iodio params object
const q4 = q3.qMap((qb, p) => qb.where({ Composer: p.Composer }))

// Get a Iodio binded to Composer 'Red Hot Chili Peppers'
const redHot = q4.pMap(() => ({
    Composer: 'Red Hot Chili Peppers'
}))

// Get a Iodio binded to Composer 'Kurt Cobain'
const cobain = q4.pMap(() => ({
    Composer: 'Kurt Cobain'
}))

// I want to work on the result of the two query
// we use async/await as DO Notation
const redHotCobain = Iodio.merge([redHot, cobain])(async (redHot, cobain) => [
    ...(await redHot),
    ...(await cobain)
])

// N.B. no real query is actually executed at this point, it's all lazy
//
// To run all the constructed computations and effects
// we call fork
redHotCobain.fork(console.error)(console.log)
```

Output:
```js
[
  'Parallel Universe by  Red Hot Chili Peppers',
  'Scar Tissue by  Red Hot Chili Peppers',
  'Otherside by  Red Hot Chili Peppers',
  'Intro by  Kurt Cobain',
  'School by  Kurt Cobain',
  'Drain You by  Kurt Cobain'
]
```


<!-- ROADMAP -->
## API

### Factories
- [`of`](#of)
- [`lift`](#lift)
- [`resolve`](#resolve)
- [`merge`](#merge)

### Methods
- [`pMap`](#pMap)
- [`qMap`](#qMap)
- [`map`](#map)
- [`pipe`](#pipe)
- [`ap`](#ap)
- [`chain`](#chain)
- [`bimap`](#bimap)

### Consuming / Collapsing Methods
- [`fork`](#fork)
- [`collapse`](#collapse)
- [`promise`](#promise)
- [`first`](#first)

## Factories

### <a id="of"></a> `of(pPred, qbR, fR)`

Iodio base constructor. It's rare to call it directly, you can call other more confortable constructors: lift, resolve, merge.
(pPred, qbR, fR)

#### Arguments:

- `pPred: Function` Paramas Predicate: a function used to bind query params to Iodio monad. Take current params map as argument and return a new param map.

- `qbR: ParamsFunction, QueryBuilderT<T>` QueryBuilder Reader: Monet Reader monad that wraps the knex query builder.

- `fR: QueryBuilderT<T>, FutureInstanceArrayT<T>` Fluture Reader: Monet Reader monad that wraps the Fluture Future representing the query output.

Returns:  **IodioInstance**

- - -
### <a id="lift"></a> `lift(db, args)`

Contruct a new IodioInstance setting knex db connection object and an array of params to pass to knex to get the QueryBuilder.

#### Arguments:

- `db: knex` The knex configured DB Connection.

- `args: Array<any>` An array to pass to knex connection to init the QueryBuilder, usually is the tableName plus other options ['TableName'].

Returns:  **IodioInstance**
- - -
### <a id="resolve"></a> `resolve(db, args)`

Contruct an IodioInstance resolved to a fixed value. Working on QueryBuilder of the resulting monad currently not supported.

#### Arguments:

- `v: any` The resolution value.

Returns:  **IodioInstance**
- - -
### <a id="merge"></a> `merge(iodio1, iodio2, ...)(doAsyncFunction)`

Useful to merge the result of two or more iodio instance and work on the values. It's like a DO notation implemented with async/await. Take present that the merge it's lazy. So a iodio passed to merge is not resolved (collapsed) until we request it's value in the supplied async function.

#### Arguments:

- `iodio1, iodio2, ...: IodioInstance` The IodioInstance wrapping the results we want to work with in the supplied async function

- `doAsyncFunction: (Promise<iodio1 res>, Promise<iodio2 res>, ...) => Promise<res>` The async function that let us work with the requested iodio value.

Returns:  **IodioInstance**
- - -

## Methods

### <a id="pMap"></a> `pMap(pred)`

Params Map. Function to transform the query params object binded to the monad.

#### Arguments:

- `pred: (a: Object=> a: Object)` Function that has the current binded params object as input and return the updated params object as output.

Returns:  **IodioInstance**
- - -

### <a id="qMap"></a> `qMap(pred)`

Query Mapper. Function to transform the knex wrapped QueryBuilder object. You can use this method to compose your query (working on Left side of the Bifunctor) without altering the future result transformations (Right side of the Bifunctor).

#### Arguments:

- `pred: ((qb: QueryBuilder, p: Object) => QueryBuilder)` For your confort the params object is passed as second argumet so you can reference binded params in the query.

Returns:  **IodioInstance**
- - -

### <a id="map"></a> `map(pred)`

Fluture Future Mapper. Function to work on the knex wrapped Fluture future monad. You can use this method to compose computations on the future result (working on Right side of the Bifunctor) without altering the QueryBuilder (Left side of the Bifunctor).

#### Arguments:

- `pred: (f: FutureInstance => f: FutureInstance)`

Returns:  **IodioInstance**
- - -

### <a id="bimap"></a> `bimap(qPred, fPred)`

It's like calling qMap and Map at the same time. Let you work on the two side of the Bifunctor.

#### Arguments:

- `qPred: ((qb: QueryBuilder, p: Object) => QueryBuilder)`
- `fPred: (f: FutureInstance => f: FutureInstance)`

Returns:  **IodioInstance**
- - -

### <a id="chain"></a> `chain(pred)`

Like _map_ but the supplied function must return an IodioInstance. The computation will continue with the new IodioInstance.

#### Arguments:

- `pred` Function returning an IodioInstance

Returns:  **IodioInstance**
- - -

### <a id="ap"></a> `ap(iodioFuntion)`

Call the function wrapped as future value in the supplied IodioInstance passing the self future value as parameter.

#### Arguments:

- `iodioFuntion: IodioInstance` An Iodio Instance that wraps a function as future value.

Returns:  **IodioInstance**
- - -

## Consuming / Collapsing Methods

### <a id="fork"></a> `fork(left)(right)`

Make the query collapse and excute it's effects on the Database. The results will be computed by the Fluture Future object and result passed to the right predicate. In case of error the left predicate is called.

#### Arguments:

- `left` Error predicate.
- `right` Error predicate.

Returns:  **Cancel**
- - -
### <a id="toString"></a> `toString()`

Debug/Inspection method. Collapse the QueryBuilder (without running the actual query) and the Fluture Future, printing a string rapresentation of both and binded params map.

Returns:  **String**
- - -
### <a id="first"></a> `first()`

Shortcut for testing purpouse. Make the IodioInstance collapse, exectuing the DB effects and retur the first result object.

Returns:  **String**
- - -
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Fabiano Taioli - ftaioli@gmail.com

Project Link: [https://github.com/FbN/iodio](https://github.com/FbN/iodio)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/FbN/iodio.svg?style=flat-square
[contributors-url]: https://github.com/FbN/iodio/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/FbN/iodio.svg?style=flat-square
[forks-url]: https://github.com/FbN/iodio/network/members
[stars-shield]: https://img.shields.io/github/stars/FbN/iodio.svg?style=flat-square
[stars-url]: https://github.com/FbN/iodio/stargazers
[issues-shield]: https://img.shields.io/github/issues/FbN/iodio.svg?style=flat-square
[issues-url]: https://github.com/FbN/iodio/issues
[license-shield]: https://img.shields.io/github/license/FbN/iodio.svg?style=flat-square
[license-url]: https://github.com/FbN/iodio/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
