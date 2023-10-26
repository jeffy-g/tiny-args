/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2022 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

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
 * @template {Record<string, TExtraArgsValue>} T
 * @param {TArgConfig} [acfg]
 * @param {boolean} [dbg]
 * @returns {T & { args?: string[]}}
 */
declare function tinArgs<T extends Record<string, TExtraArgsValue>>(acfg?: TArgConfig, dbg?: boolean): T & {
    args?: string[];
};
declare namespace tinArgs {
    export { TExtraArgsValue, TArgConfig };
}
type TExtraArgsValue = string | string[] | boolean | RegExp | number;
type TArgConfig = {
    /**
     * default `2`
     */
    startIndex?: number;
    /**
     * default "-"
     */
    prefix?: string;
};

export = tinArgs;
