import tinArgs from "./index.mjs";

/**
 * @typedef TArgs
 * @prop {string | string[]} basePath scan base
 * @prop {string[]} extras extra files
 * @prop {string} dest output path
 * @prop {boolean} r recursive?
 * @prop {string} ext extension
 * @prop {RegExp} test
 */

// node ./arg-test.mjs --basePath build --r --extras "index.html,somename.js" --count 0x12ab --ext ".js" --test "/\\.(j|t)s$/" .git/*
/**
 * will be:
 * ```ts
 *  const params: TArgs & { args?: string[]; }
 * ```
 * @type {ReturnType<typeof tinArgs<TArgs>>}
 */
const params = tinArgs();
console.log(params);
