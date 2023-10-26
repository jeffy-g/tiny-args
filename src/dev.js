/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2022 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

/**
 * @typedef {string | string[] | boolean | RegExp | number} TExtraArgsValue
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
 * @template {Record<string, TExtraArgsValue>} T
 * @param {TArgConfig} [acfg]
 * @param {boolean} [dbg]
 * @returns {T & { args?: string[]}}
 */
 const tinArgs = (acfg, dbg = false) => {

    // debug log, if need.
    dbg && console.log("process.argv: ", process.argv);
    // @ts- ignore will be not `Partial`
    acfg = /** @type {Required<TArgConfig>} */(acfg || {});

    const pfix = acfg.prefix || "-";
    // option name index
    const vIdx = pfix.length;
    // extra index
    const eIdx = acfg.startIndex || 2, pms = /** @type {T & { args?: string[]}} */({});

    if (process.argv.length > eIdx) {
        const cArgs = process.argv;
        for (let idx = eIdx; idx < cArgs.length;) {
            const opt = cArgs[idx++];
            if (opt) {
                if (opt.startsWith(pfix)) {
                    /** @type {TExtraArgsValue} */
                    let v = cArgs[idx];
                    if (v === void 0 || v.startsWith(pfix)) {
                        v = true;
                    } else {
                        // DEVNOTE: now possible to process array parameters
                        // DEVNOTE: 2020/2/28 - support regex parameter
                        if (/^\[.+\]$/.test(v) || /^(?:re)?\/[^/]+\/[gimuys]{0,6}$/.test(v)) {
                            /^re\//.test(v) && (v = v.substring(2));
                            // value is array or regex
                            v = /** @type {string[] | RegExp} */(eval(v));
                        } else if (/\\,/.test(v)) { // not Comma Separated Value
                            // DEVNOTE: fix comma in glob strings
                            v = v.replace(/\\,/g, ",");
                        } else if (/,/.test(v)) { // Comma Separated Value
                            v = v.split(",");
                        } else if (/^(?:-?\.?\d+(?:\.\d*)?|0x[\da-f]+)$/i.test(v)) {
                            // DEVNOTE: 2022/05/15 - support number
                            //   "-1234,-.1234,1234.1234,1234.,0x12f".split(",").map(v => /^(?:-?\.?\d+(?:\.\d*)?|0x[\da-f]+)$/i.test(v));
                            //     -> [true, true, true, true, true]
                            v = +v;
                        }
                        idx++;
                    }
                    /** @type {any} */(pms)[opt.substring(vIdx)] = v;
                } else {
                    (pms.args || (pms.args = [])).push(opt);
                }
            }
        }
    }
    return pms;
};

module.exports = tinArgs;
