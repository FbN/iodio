[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



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
    Implements Fantasy Land: <strong>Functor</strong>, <strong>Bifunctor</strong>,
    <strong>Apply</strong>, <strong>Applicative</strong>, <strong>Chain</strong>,
    <strong>Monad</strong>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



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

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
```sh
npm install npm@latest -g
```

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
```sh
git clone https://github.com/your_username_/Project-Name.git
```
3. Install NPM packages
```sh
npm install
```
4. Enter your API in `config.js`
```JS
const API_KEY = 'ENTER YOUR API';
```



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)
* [Animate.css](https://daneden.github.io/animate.css)
* [Loaders.css](https://connoratherton.com/loaders)
* [Slick Carousel](https://kenwheeler.github.io/slick)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [Sticky Kit](http://leafo.net/sticky-kit)
* [JVectorMap](http://jvectormap.com)
* [Font Awesome](https://fontawesome.com)





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
