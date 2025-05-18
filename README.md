![LICENSE](https://img.shields.io/badge/License-MIT-blue.svg)
[![npm version](https://badge.fury.io/js/tin-args.svg)](https://badge.fury.io/js/tin-args)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jeffy-g/tiny-args.svg?style=plastic)
![npm bundle size](https://img.shields.io/bundlephobia/min/tin-args?style=plastic)
![npm](https://img.shields.io/npm/dm/tin-args.svg?style=plastic)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jeffy-g/tiny-args.svg?style=plastic)

# tin-args

A **simple command-line argument parser** for Node.js with no external dependencies.  
It automatically parses booleans, numbers, arrays, RegExps, and string values from `-key value` style inputs.

> **Note:** Only single-dash (`-option`) arguments are supported.  
> If you're expecting `--long-option` support, consider alternatives like `minimist`, `yargs`.

---

## ✨ Features

- Single-dash CLI options like `-minify true`, `-factor 123.5`, `-regex "re/\\d+/g"` supported
- Auto-detects:
  - Numbers: `-num 123`
  - Booleans: `-flag`
  - Arrays: `-list "v1,v2,v3"`
  - Regex: `-re "re/\\.(j|t)s$/g"`
- Ignores positional args and collects them into `args: string[]`

---

## 📦 Install

```bash
npm i tin-args
# or
yarn add tin-args
````

---

## 🚀 Usage

```js
const getExtraArgs = require("tin-args");

/**
 * @typedef TArgs
 * @prop {RegExp} test A regex value
 * @prop {number} factor A numeric value
 * @prop {boolean} minify A boolean flag
 * @prop {string[]} values Array of strings
 * @prop {string[]} values2 Array of strings
 * @prop {any[]} a Array of mixed values
 */

/**
 * will be:
 * ```ts
 *  const params: TArgs & { args?: string[]; }
 * ```
 * @type {ReturnType<typeof getExtraArgs<TArgs>>}
 */
const params = getExtraArgs({ prefix: "-" });

console.log(params);
```

### CLI Example:

+ run `arg-test.js` with node

```shell
$ yarn test .git/* # OR npm run test -- .git/*
```

Output:

```shell
{
  test: /(?<=reference path=")(\.)(?=\/index.d.ts")/,
  factor: 123.5,
  minify: true,
  values: [ 'v0', 'v1', 'v2' ],
  values2: [ 'v0', 'v1', 'v2' ],
  a: [ 'value0', 100, true, /\r?\n/g ],
  args: [
    '.git/config',
    '.git/description',
    '.git/HEAD',
    '.git/hooks',
    '.git/index',
    '.git/info',
    '.git/logs',
    '.git/objects',
    '.git/packed-refs',
    '.git/refs',
    '.git/tortoisegit.data',
    '.git/tortoisegit.index'
  ]
}
```

---

## 🧠 Notes on RegExp values

If you want the parser to recognize a RegExp, use the `re` prefix:

```bash
node arg-test.js -re "re/\\.(j|t)s$/g"
```

---

## 📄 License

MIT © 2022 [jeffy-g](mailto:hirotom1107@gmail.com)
