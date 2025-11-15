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
# "debug": "node ./arg-test -re0 /[a-z0-0]/gim -re1 /\\.m?js$/gim -re2 \"/\\.(j|t)s$/gim\" -re3 \"/a|b/gi\" -regex:\"/(?<=reference path=\\\")(\\.\\.)(?=\\/index.d.ts\\\")/\""
node ./arg-test -re0 "r/[a-z0-0]/gim" -re1 "r/\.m?js$/gim" -re2 "r/\.(j|t)s$/gim" -re3 "r/a|b/gi" -regex:"r/(?<=reference path=\")(\.\.)(?=\/index.d.ts\")/"
```

---

### Handling JavaScript RegExp CLI Parameters in Bash

When passing JavaScript regular expression literals (e.g. `/[a-z]/gim`) as command-line arguments to Node.js scripts in Bash, you may encounter unexpected behavior.  
Bash typically interprets a leading `/` in arguments as the start of a file system path, causing tab-completion issues, unwanted pathname expansion, or errors if the path does not exist.

To resolve this, **tin-args** introduces a simple prefix system:  
You can pass regex arguments in the form of `"r/.../flags"` or `"re/.../flags"`.  
This avoids Bash path interpretation and makes your CLI usage more robust and predictable.

**Example:**

```bash
# yarn debug
dev.js(v0.1.1): {
  re0: /[a-z0-0]/gim,
  re1: /\.m?js$/gim,
  re2: /\.(j|t)s$/gim,
  re3: /a|b/gi,
  regex: /(?<=reference path=")(\.\.)(?=\/index.d.ts")/
}
# node ./arg-test.js -re0 "r/[a-z0-0]/gim" -re1 "r/\.m?js$/gim" -re2 "r/\.(j|t)s$/gim" -re3 "r/a|b/gi" -regex:"r/(?<=reference path=\")(\.\.)(?=\/index.d.ts\")/"
dev.js(v0.1.1): {
  re0: /[a-z0-0]/gim,
  re1: /\.m?js$/gim,
  re2: /\.(j|t)s$/gim,
  re3: /a|b/gi,
  regex: /(?<=reference path=")(\.\.)(?=\/index.d.ts")/
}
# node ./arg-test.js -re0 "/[a-z0-0]/gim" -re1 "/\.m?js$/gim" -re2 "/\.(j|t)s$/gim" -re3 "/a|b/gi" -regex:"/(?<=reference path=\")(\.\.)(?=\/index.d.ts\")/"
dev.js(v0.1.1): {
  re0: '/path/to/bash/root/[a-z0-0]/gim',
  re1: undefined,
  re2: undefined,
  re3: '/path/to/bash/root/a|b/gi',
  regex: '/path/to/bash/root/(?<=reference path=")(\\.\\.)(?=\\/index.d.ts")/'
}
```

**Why this matters:**

Without the `r/` or `re/` prefix, Bash may treat `/[a-z]/g` as a path,  
which can result in incorrect command behavior, errors, or accidental path expansion. 

By using a prefix and letting **tin-args** handle parsing, you ensure your regular expression arguments are interpreted exactly as intended.

---

### Note on Using RegExp Arguments in **package.json** Scripts

When specifying CLI arguments directly in your terminal, Bash interprets leading slashes (`/`) in arguments as filesystem paths, which can cause unwanted expansion or errors.  
However, when you run commands via `npm run` (i.e., using the `scripts` section of your `package.json`), **this pathname expansion does not occur**, and arguments like `/[a-z]/g` are passed to your script as-is.

**Example usage in `package.json`:**

```json
{
  "scripts": {
    "debug": "node ./arg-test -re0 /[a-z0-0]/gim -re1 /\\.m?js$/gim -re2 \"/\\.(j|t)s$/gim\" -re3 \"/a|b/gi\" -regex:\"/(?<=reference path=\\\")(\\.\\.)(?=\\/index.d.ts\\\")/\""
  }
}
```

**Caveats:**  
- Quotes are generally necessary for complex regexps or arguments containing spaces and special characters.
- Behavior may still vary depending on your OS and shell, so testing is advised.

**Summary:**  
- When running commands directly in your terminal, you should use the `r/.../flags` prefix to avoid Bash's path expansion issues.
- When using commands in `package.json` scripts via `npm run`, arguments starting with `/` are safe *and* do not trigger path expansion.

  > __TIP__
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
