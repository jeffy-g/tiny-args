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
 * @prop {string[]} extras extra files
 * @prop {string} dest output path
 * @prop {boolean} r recursive?
 * @prop {string} ext extension
 * @prop {RegExp} test
 */

/**
 * will be:
 * ```ts
 *  const params: TArgs & { args?: string[]; }
 * ```
 * @type {ReturnType<typeof getExtraArgs<TArgs>>}
 */
const params = getExtraArgs({ prefex: "--" });
console.log(params);
```

+ run `arg-test.js` with node

```shell
$ node ./arg-test --basePath build --r --extras "index.html,somename.js" --dest ./dist --ext ".js" --test "/\\.(j|t)s$/" .git/*
{
  basePath: 'build',
  r: true,
  extras: [ 'index.html', 'somename.js' ],
  dest: './dist',
  ext: '.js',
  test: '//.(j|t)s$/',
  args: [
    '.git/COMMIT_EDITMSG',
    '.git/config',
    '.git/description',
    '.git/FETCH_HEAD',
    '.git/HEAD',
    '.git/hooks',
    '.git/index',
    '.git/info',
    '.git/logs',
    '.git/objects',
    '.git/ORIG_HEAD',
    '.git/packed-refs',
    '.git/refs'
  ]
}
```
