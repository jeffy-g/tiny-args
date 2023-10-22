![LICENSE](https://img.shields.io/badge/Lisence-MIT-blue.svg)
[![npm version](https://badge.fury.io/js/tin-args.svg)](https://badge.fury.io/js/tin-args)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jeffy-g/tiny-args.svg?style=plastic)
![npm bundle size](https://img.shields.io/bundlephobia/min/tin-args?style=plastic)
![npm](https://img.shields.io/npm/dm/tin-args.svg?style=plastic)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jeffy-g/tiny-args.svg?style=plastic)

# tin-args

  + Simple command line argument extraction script with no complicated feature

+ arg-test.js

```js
const getExtraArgs = require("tin-args");

/**
 * @typedef TArgs
 * @prop {string | string[]} basePath scan base
 * @prop {boolean} minify use minify?
 * @prop {string[]} values some values as array
 * @prop {string[]} values2 some values as array
 * @prop {number} factor
 * @prop {RegExp} test
 */

/**
 * will be:
 * ```ts
 *  const params: TArgs & { args?: string[]; }
 * ```
 * @type {ReturnType<typeof getExtraArgs<TArgs>>}
 */
const params = getExtraArgs({ prefex: "-" });
console.log(params);
```

+ run `arg-test.js` with node

```shell
$ node ./arg-test -test "re/\\.(t|j)s$/" -factor 123.5 -minify es6 -values "v0,v1,v2" -values2 v0,v1,v2 -a "['value0', 100, true, /\\r?\\n/g]" .git/*
{
  test: /\.(t|j)s$/,
  factor: 123.5,
  minify: 'es6',
  values: [ 'v0', 'v1', 'v2' ],
  values2: [ 'v0', 'v1', 'v2' ],
  a: [ 'value0', 100, true, /\r?\n/g ],
  args: [
    '.git/COMMIT_EDITMSG',
    '.git/FETCH_HEAD',
    '.git/HEAD',
    '.git/ORIG_HEAD',
    '.git/config',
    '.git/description',
    '.git/hooks',
    '.git/index',
    '.git/info',
    '.git/logs',
    '.git/objects',
    '.git/packed-refs',
    '.git/refs',
    '.git/tgitchangelist',
    '.git/tortoisegit.data',
    '.git/tortoisegit.index'
  ]
}
```

## NOTE for regex param value

  + If you use js regex as a parameter, you should be sure to recognize it as a regex object by adding `re` prefix.  
    e.g - `"re/\\.(j|t)s$/g"`

  + `yarn test -re "re/\\.(j|t)s$/g"`

