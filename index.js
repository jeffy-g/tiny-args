"use strict";
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
const tinArgs=(acfg,dbg=!1)=>{dbg&&console.log("process.argv: ",process.argv),acfg=/** @type {Required<TArgConfig>} */acfg||{};const pfix=acfg.prefix||"-",vIdx=pfix.length,eIdx=acfg.startIndex||2,pms=/** @type {T & { args?: string[]}} */({});if(process.argv.length>eIdx){const cArgs=process.argv;for(let idx=eIdx,argsLen=cArgs.length;idx<argsLen;){const opt=cArgs[idx++];if(opt)if(opt.startsWith(pfix)){
/** @type {TExtraArgsValue} */
let v=cArgs[idx];void 0===v||v.startsWith(pfix)?v=!0:(/^\[.+\]$/.test(v)||/^(?:re)?\/[^]+\/[dgimsuy]{0,7}$/.test(v)?(/^re\//.test(v)&&(v=v.substring(2)),v=/** @type {string[] | RegExp} */eval(v)):/\\,/.test(v)?v=v.replace(/\\,/g,","):/,/.test(v)?v=v.split(","):/^(?:-?\.?\d+(?:\.\d*)?|0x[\da-f]+)$/i.test(v)&&(v=+v),idx++);
/** @type {any} */(pms)[opt.slice(vIdx)]=v}else(pms.args||(pms.args=[])).push(opt)}}return pms};module.exports=tinArgs;