/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2022 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="../index.d.ts"/>

/**
 * @typedef {string | string[] | boolean | RegExp | number} TExtraArgsValue
 * @typedef {[string, string, "true" | "false"]} TRegexExecCustom
 * @typedef TArgConfig
 * @prop {number} [startIndex] default `2`
 * @prop {string} [prefix] default "-"
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
 * @template {Record<string, NsTinArgs.TExtraArgsValue>} T
 * @param {NsTinArgs.TArgConfig?=} acfg
 * @param {boolean?=} dbg
 * @returns {T & { args?: string[]}}
 */
const tinArgs = (acfg, dbg = false) => {

  // debug log, if need.
  dbg && console.log("process.argv: ", process.argv);
  // @ts- ignore will be not `Partial`
  acfg = /** @type {Required<NsTinArgs.TArgConfig>} */(acfg || {});

  const pfix = acfg.prefix || "-";
  // option name index
  const vIdx = pfix.length;
  // extra index
  const eIdx = acfg.startIndex || 2, pms = /** @type {T & { args?: string[]}} */({});

  if (process.argv.length > eIdx) {
    const cArgs = process.argv;
    for (let idx = eIdx, argsLen = cArgs.length; idx < argsLen;) {
      const optOrArg = cArgs[idx++];
      if (optOrArg) {
        if (optOrArg.startsWith(pfix)) {
          // DEVNOTE: 2025/11/14 3:18:58 - Use "||" operator for legacy node support (Don't use the "??" operator)
          const fallback = optOrArg.slice(vIdx);
          /** @type {TRegexExecCustom} */
          const [, paramName = fallback, bool] = /^([^:=]+)(?:[:=]{1}([^:=]+))?$/.exec(fallback) || /** @type {any} */([]);
          // check for
          if (bool) {
            (/** @type {NsTinArgs.TTinArgsKV} */(pms))[paramName] = boolMap[bool];
            continue;
          }

          /** @type {NsTinArgs.TExtraArgsValue} */
          let v = cArgs[idx];
          if (v === void 0 || v.startsWith(pfix)) {
            v = true;
          } else {
            // DEVNOTE: now possible to process array parameters
            // DEVNOTE: 2020/2/28 - support regex parameter
            // /^\[.+\]$/, /^(?:re|r)?\/[^]+\/[dgimsuy]{0,7}$/
            //   -> /^(?:re|r)\//
            if (/^\[.+\]$/.test(v) || /^(?:re|r)?\/[^]+\/[dgimsuy]{0,7}$/.test(v)) {
              /^(?:re|r)\//.test(v) && (v = v.slice(v.indexOf("/")));
              // value is array or regex
              v = /** @type {string[] | RegExp} */(eval(v));
            } else if (/\\,/.test(v)) { // not Comma Separated Value
              // DEVNOTE: fix comma in glob strings
              v = v.replace(/\\,/g, ",");
            } else if (/,/.test(v)) { // Comma Separated Value
              // NOTE: There should be no whitespace before or after the separator, such as "a,b,c".
              v = v.split(",");
            } else if (/^(?:-?\.?\d+(?:\.\d*)?|0x[\da-f]+)$/i.test(v)) {
              // DEVNOTE: 2022/05/15 - support number
              //   "-1234,-.1234,1234.1234,1234.,0x12f".split(",").map(v => /^(?:-?\.?\d+(?:\.\d*)?|0x[\da-f]+)$/i.test(v));
              //     -> [true, true, true, true, true]
              v = +v;
            }

            idx++;
          }

          (/** @type {NsTinArgs.TTinArgsKV} */(pms))[paramName] = v;
        } else {
          (pms.args || (pms.args = [])).push(optOrArg);
        }
      }
    }
  }

  return pms;
};

const boolMap = {
  true: true, false: false
};

module.exports = tinArgs;
