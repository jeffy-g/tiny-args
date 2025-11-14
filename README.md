![LICENSE](https://img.shields.io/badge/License-MIT-blue.svg)
[![npm version](https://badge.fury.io/js/tin-args.svg)](https://badge.fury.io/js/tin-args)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jeffy-g/tiny-args.svg?style=plastic)
![npm bundle size](https://img.shields.io/bundlephobia/min/tin-args?style=plastic)
![npm](https://img.shields.io/npm/dm/tin-args.svg?style=plastic)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jeffy-g/tiny-args.svg?style=plastic)

# tin-args

A simple, zero-dependency command-line argument parser for Node.js.  
Parses booleans, numbers, arrays, RegExps, and strings using `-key:value`, `-key=value`, or `-key value` syntax.

> ### Note:

+ The default option prefix is `-`. You can change it (e.g. to `--`) via `tinArgs({ prefix: "--" })`.  
  Can also set characters other than `-`.

---

## ✨ Features

- KV pair syntax: `-key:value`, `-key=value`.
- Flexible value syntax: also supports `-key value`.
- Auto-detects and parses:
  - Numbers: `-n:123`, `-n:-123.45`, `-n:0x12ab` (direct numeric conversion).
  - Booleans: `-flag` (becomes `true`), or `-flag:true`, `-flag:false`.
  - Arrays: `-list:"a,b,c"` becomes `['a', 'b', 'c']`.
  - RegExp: `-p:r/\\.(j|t)s/i` or `-p:re/\\.(j|t)s/i`.
  - Strings: quotes are optional; preserved as needed.
- Escaped commas: use `\\,` to keep commas in a single string (no splitting).
- Positional arguments: non-option args are collected into `args: string[]`.
- Configurable parsing: `{ prefix?: string; startIndex?: number }`.

---

## 📦 Install

```bash
npm i tin-args
# or
yarn add tin-args
````

---

## 🚀 Usage

Create a script, for example `my-script.js`:
```js
const tinArgs = require("tin-args");

// The generic <T> is optional but provides type hints for the output.
/**
 * @typedef TArgs
 * @prop {boolean} isOk
 * @prop {number} count
 * @prop {number} num
 * @prop {string[]} extras
 * @prop {RegExp} pattern
 */

/** @type {ReturnType<typeof tinArgs<TArgs>>} */
const params = tinArgs();

console.log(params);
```

### CLI Example

Run the script from your terminal with various arguments:

```shell
$ node my-script.js -isOk:true -count:0x12ab -num:-123.45 -extras:"a,b,c" -regex:"re/\.(j|t)s$/gi" some/path
```

### Output

The `params` object will look like this:

```js
{
  isOk: true,
  count: 4779,
  num: -123.45,
  extras: [ 'a', 'b', 'c' ],
  regex: /\.(j|t)s$/gi,
  args: [ 'some/path' ]
}
```

---

## 🧠 Notes on RegExp values

To pass a `RegExp`, prefix the pattern with `re/` or `r/`:

```bash
# quoted examples (recommended)
$ node arg-test.js -pattern:"re/\.(j|t)s$/gi" # 🆗️ 
$ node arg-test.js -pattern 'r/\.(j|t)s$/gi' # 🆗️
# unquoted may cause shell parsing errors if it contains (), [], or |
$ node arg-test.js -pattern r/\.(j|t)s$/gi # ❌ may error depending on shell
$ node arg-test.js -pattern r/\.mjs$/gi # 🆗️
$ node arg-test.js -pattern r/a|b/gi # ❌ error
$ node arg-test.js -pattern 'r/a|b/gi' # 🆗️
$ node arg-test.js -pattern 'r/[0-9a-z]/gi' # 🆗️
$ node arg-test.js -pattern r/[0-9a-z]/gi # ❌ error
```

> ### TIP:
>
> When your regex contains special shell characters like __`(`__, __`)`__, __`|`__, __`[`__, or __`]`__,  
  you may need to wrap the argument in quotes to prevent the shell from interpreting them.
>
> + `r/[0-9a-z]/gi` -> `"r/[0-9a-z]/gi"`
>
> In such cases, you may also need to escape quotes (`"`) or other characters appropriately depending on your shell.

### Escaped commas

Comma-separated values are split into arrays. To keep commas as literal characters in a single string, escape them with a backslash:

```bash
$ node my-script.js -list:"a,b,c"           # -> ["a","b","c"]
$ node my-script.js -glob:"src\\,test/*.js" # -> "src,test/*.js"
```

---

## 🤝 For Contributors

This project uses several tools for development (e.g., `typescript` for type-checking, `prettier` for formatting). If you clone this repository to contribute, install these dependencies with:

```bash
npm install
# or
yarn
```
This will install all the necessary packages listed in `devDependencies` and `peerDependencies`.

---

## 📄 License

MIT © 2022 [jeffy-g](https://github.com/jeffy-g)
