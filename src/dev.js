/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  Copyright (C) 2022 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/
/// <reference path="../index.d.ts"/>

/**
 * @typedef {[string, string, string | undefined]} TRegexExecCustom
 */

const boolMap = {
  true: true, false: false
};
/**
 * Support **KV pair**
 * 
 * @param {string} v 
 * @returns {NsTinArgs.TExtraArgsValue}
 * @date 2025/11/14
 * @since v0.1.0
 * @summary 2025/11/14 - support short prefix "r" for regex value, direct number convert
 */
const parseValue = (v) => {

  const bool = boolMap[/** @type {keyof boolMap} */(v)];
  if (bool !== undefined) {
    return bool;
  }

  // DEVNOTE: now possible to process array parameters
  // DEVNOTE: 2020/2/28 - support regex parameter
  // DEVNOTE: 2025/11/14 - support short prefix "r"
  // DEVNOTE: 2026/02/03 - support new regexp flag "v"
  if (/^\[.+\]$/.test(v) || /^(?:re|r)?\/[^]+\/[dgimsuvy]{0,8}$/.test(v)) {
    /^(?:re|r)\//.test(v) && (v = v.slice(v.indexOf("/")));
    // value is array or regex
    return /** @type {string[] | RegExp} */(eval(v));
  } else if (/\\,/.test(v)) { // not Comma Separated Value
    // DEVNOTE: fix comma in glob strings
    return v.replace(/\\,/g, ",");
  } else if (/,/.test(v)) { // Comma Separated Value
    // NOTE: There should be no whitespace before or after the separator, such as "a,b,c".
    return v.split(",");
  } else {
    // DEVNOTE: 2025/11/14 - Abolish regex based numeric string validation and try to convert directly with the "+" operator
    const num = +v;
    if (Number.isFinite(num)) return num;
    return v;
  }
};

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
const tinArgs = (acfg, dbg = false) => {

  const cArgs = process.argv;

  // debug log, if need.
  dbg && console.log("process.argv: ", cArgs);

  // DEVNOTE: 2025/11/14 - Use "||" operator for legacy node support (Don't use the "??" operator)
  acfg = /** @type {Required<NsTinArgs.TArgConfig>} */(acfg || {});

  const pfix = acfg.prefix || "-";
  // option name index
  const vIdx = pfix.length;
  // extra index
  const eIdx = acfg.startIndex || 2, pms = /** @type {T & { args?: string[]}} */({});

  if (cArgs.length > eIdx) {
    for (let idx = eIdx, argsLen = cArgs.length; idx < argsLen;) {
      const optOrArg = cArgs[idx++];
      if (optOrArg) {
        if (optOrArg.startsWith(pfix)) { // means option parameter

          // DEVNOTE: 2025/11/14 - support short prefix "r" for regex value, direct number convert
          const fallback = optOrArg.slice(vIdx);
          /** @type {TRegexExecCustom} */
          const [, paramName = fallback, boolOrNot] = /^([^:=]+)(?:[:=](.+))?$/.exec(fallback) || /** @type {any} */([]);

          /** @type {NsTinArgs.TExtraArgsValue} */
          let optValue;
          if (boolOrNot) { // -bool:true, -num:numberStr, -regex:"re/regexExpression/g", ...
            optValue = parseValue(boolOrNot);
          } else {
            optValue = cArgs[idx];
            if (optValue === void 0 || optValue.startsWith(pfix)) {
              optValue = true;
            } else {
              optValue = parseValue(optValue);
              idx++;
            }
          }
          (/** @type {NsTinArgs.TTinArgsKV} */(pms))[paramName] = optValue;
        } else { // means not option parameter
          (pms.args || (pms.args = [])).push(optOrArg);
        }
      }
    }
  }

  return pms;
};
tinArgs.version = "v0.1.2";

module.exports = tinArgs;
