# AWI Auth
The autentication part of the AWI project.

## Instalattion
You need Node.js & npm. Once installed simply run `npm install` followed by `npm start` and you should be running.
The `npm start-watch` command also start [nodemon](https://nodemon.io/). Nodemon monitor your changes and so, it reload your files when you changes them.

## Tests
Tests are located inside the test fodler. They work using [jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest). Jest allow to make tests using a simple API and supertest allow to test very easly an HTTP server. To run the tests once use `npm run test`. To run the test after each changes use `npm run test-watch`.

## Style
This project use [standard](https://standardjs.com/). Standard help to improve code readability by standardizing code style. To run standard type `npm run style`. To let standard auto fix the errors type `npm run style-fix`.