/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2022 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

export = tinArgs;

/**
 * get arguments helper.  
 * extra params must be start with "-".
 * 
 * > command example:
 * 
 * ```shell
 * node <script path> -minify -t es6 -values "value0,value1,value2" -array "['value0', 100, true, /\r?\n/g]" -regex "re/\d+/g"
 * ```
 *
 * + then resut is
 *
 * ```js
 * // params
 * {
 *   minify: true,
 *   t: "es6",
 *   values: ["value0", "value1", "value2"],
 *   array: ["value0", 100, true, /\r?\n/g],
 *   regex: /\d+/g,
 * }
 * ```
 *
 * if param value not specified -tag after then set value is "true".
 * 
 * @template {Record<string, NsTinArgs.TExtraArgsValue>} T
 * @param {NsTinArgs.TArgConfig?=} acfg
 * @param {boolean?=} dbg
 * @returns {T & { args?: string[]}}
 */
declare function tinArgs<T extends Record<string, NsTinArgs.TExtraArgsValue>>(acfg?: NsTinArgs.TArgConfig | null, dbg?: boolean | null): T & {
  args?: string[];
};

declare namespace tinArgs {
  export const version: string;
  // Since it is converted to an esm module by `node`,
  // `default` becomes a main funciton.
  const _default: typeof tinArgs;
  export { _default as default };
}

declare global {
  namespace NsTinArgs {
    export type TExtraArgsValueBase = string | number | boolean | RegExp;
    export type TExtraArgsValue = TExtraArgsValueBase | TExtraArgsValueBase[];
    export type TTinArgsKV = Record<string, TExtraArgsValue>;
    export type TArgConfig = {
      startIndex?: number;
      prefix?: string;
    };
  }
}
