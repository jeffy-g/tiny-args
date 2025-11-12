const tinArgs = require("./");

/**
 * @typedef TArgs
 * @prop {string | string[]} basePath scan base
 * @prop {boolean} r recursive?
 * @prop {string[]} extras extra files
 * @prop {number} count
 * @prop {string} ext extension
 * @prop {RegExp} test
 */

// node ./arg-test -basePath build -r -extras "index.html,somename.js" -count 0x12ab -ext ".js" -test "/\\.(j|t)s$/" .git/*
// node ./arg-test -test "re/\\.(t|j)s$/" -minify -t es6 -values "v0,v1,v2" -values2 v0,v1,v2 -a "['value0', 100, true, /\\r?\\n/g]" .git/*
/**
 * will be:
 * ```ts
 *  const params: TArgs & { args?: string[]; }
 * ```
 * @type {ReturnType<typeof tinArgs<TArgs>>}
 */
const params = tinArgs(undefined, true);
console.log(params);
