const prevVer = require("./src/0.0.18");
const tinArgs = require("./index.js");
// const tinArgs = require("./src/dev.js");

/**
 * @typedef TArgs
 * @prop {string | string[]} basePath scan base
 * @prop {boolean} r recursive?
 * @prop {string[]} extras extra files
 * @prop {number} count
 * @prop {string} ext extension
 * @prop {RegExp} test
 */

/**
 * will be:
 * ```ts
 *  const params: TArgs & { args?: string[]; }
 * ```
 * @type {ReturnType<typeof tinArgs<TArgs>>}
 */
const oldParams = prevVer(null, true);
console.log("0.0.18.js:", oldParams);
/**
 * @type {ReturnType<typeof tinArgs<TArgs>>}
 */
const params = tinArgs();
console.log("dev.js:", params);
