define(function (require) {
    'use strict';

    /**
     * utility functions of koko
     *
     * @exports util
     */
    var exports = {};

    exports.object = {};
    exports.string = {};

    var type = require('./type');
    var generic = require('./generic');
    var _ = require('./es5');

    /**
     * get values of an object
     *
     * @method values
     * @param {Object} obj target object
     * @return {Array.<string>} the value array
     */
    exports.values = exports.object.values = function (obj) {
        var values = [];
        generic.forInOwn(obj, function (value, key) {
            values.push(value);
        });
        return values;
    };


    /**
     * extend object
     *
     * @method extend
     * @param {boolean=} isDeepArg if deep extend or not
     * @param {Object} prevArg the previous object
     * @param {...Object} adds the to be added object
     * @return {Object} result
     */
    exports.extend = exports.object.extend = function (isDeepArg, prevArg, adds) {
        var i;
        var prev;
        var isDeep;

        if (type.typeOf(isDeepArg) !== 'boolean') {
            i = 1;
            prev = isDeepArg;
            isDeep = false;
        } else {
            i = 2;
            prev = prevArg;
            isDeep = isDeepArg;
        }

        var addNum = arguments.length;
        for (; i < addNum; i++) {
            var add = arguments[i];
            // not null or undefined
            if (add) {
                generic.forInOwn(add, function (value, key) {
                    // prevent never-ending loop
                    if (value !== prev) {
                        if (isDeep && type.isPlainObject(value)) {
                            var prevValue = type.isPlainObject(prev[key]) ? prev[key] : {};
                            prev[key] = exports.extend(isDeep, prevValue, value);
                        } else if (isDeep && type.isArray(value)) {
                            var prevValue = type.isArray(prev[key]) ? prev[key] : [];
                            prev[key] = exports.extend(isDeep, prevValue, value);
                        // don't bring in undefined values
                        } else if (!type.isUndefined(value)) {
                            prev[key] = value;
                        }
                    }
                });
            }
        }

        return prev;
    };


    /**
     * encodeHTML
     *
     * @method encodeHTML
     * @param {string} str target string
     * @return {string} result
     */
    exports.encodeHTML = exports.string.encodeHTML = function (str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };


    /**
     * decodeHTML
     *
     * @method decodeHTML
     * @param {string} str target string
     * @return {string} result
     */
    exports.decodeHTML = exports.string.decodeHTML = function (str) {
        var result = String(str)
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
        return result.replace(/&#([\d]+);/g, function (_0, _1) {
            return String.fromCharCode(parseInt(_1, 10));
        });
    };


    /**
     * escapeRegExp
     *
     * @method escapeRegExp
     * @param {string} str target string
     * @return {string} result
     */
    exports.escapeRegExp = exports.string.escapeRegExp = function (str) {
        return String(str).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    };


    /**
     * convert target string to camel case
     *
     * @method toCamelCase
     * @param {string} str target string
     * @return {string} converted string
     */
    exports.toCamelCase = exports.string.toCamelCase = function (str) {
        return String(str).replace(
            /-([\da-z])/gi,
            function (match, letter) {
                return letter.toUpperCase();
            }
        );
    };


    /**
     * convert target string to pascal case
     *
     * @method toPascalCase
     * @param {string} str target string
     * @return {string} converted string
     */
    exports.toPascalCase = exports.string.toPascalCase = function (str) {
        return exports.toCamelCase(str).replace(
            /^[a-z]/,
            function (match) {
                return match.toUpperCase();
            }
        );
    };


    /**
     * convert target string to dash case
     *
     * @method toDash
     * @param {string} str target string
     * @return {string} converted string
     */
    exports.toDash = exports.string.toDash = function (str) {
        return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    };


    /**
     * pad source with leading character
     *
     * @method pad
     * @param {(number | string)} source source
     * @param {number} width string width after paded
     * @param {string} leading leading character
     * @return {string} result
     */
    exports.pad = exports.string.pad = function (source, width, leading) {
        var str = String(source);
        return str.length > width
            ? str
            : new Array(width - str.length + 1).join(leading) + str;
    };


    /**
     * pad number with leading zero
     *
     * @method padZero
     * @param {(number | string)} source source
     * @param {number} width string width after paded
     * @return {string} result
     */
    exports.padZero = exports.string.padZero = function (source, width) {
        var str = String(Math.abs(source | 0));
        return (source < 0 ? '-' : '') + exports.pad(str, width, '0');
    };


    /**
     * clone object
     *
     * @inner
     * @method cloneObject
     * @param {boolean=} isDeep if deep clone or not
     * @param {Object} obj target object
     * @return {Object} result
     */
    function cloneObject(isDeep, obj) {
        var result = {};
        var isDeepInside;
        var objInside;

        if (type.typeOf(isDeep) !== 'boolean') {
            isDeepInside = false;
            objInside = isDeep;
        } else {
            isDeepInside = isDeep;
            objInside = obj;
        }

        if (type.isPlainObject(objInside)) {
            if (isDeepInside) {
                generic.forInOwn(objInside, function (value, key) {
                    result[key] = exports.clone(value);
                });
            } else {
                generic.forInOwn(objInside, function (value, key) {
                    result[key] = value;
                });
            }
            return result;
        }

        return objInside;
    }


    /**
     * clone array
     *
     * @inner
     * @method cloneArray
     * @param {boolean=} isDeep if deep clone or not
     * @param {Array} arr target arrya
     * @return {Array} result
     */
    function cloneArray(isDeep, arr) {
        var result = [];
        var isDeepInside;
        var arrInside;

        if (type.typeOf(isDeep) !== 'boolean') {
            isDeepInside = false;
            arrInside = isDeep;
        } else {
            isDeepInside = isDeep;
            arrInside = arr;
        }

        if (isDeepInside) {
            _.forEach(arrInside, function (item, index) {
                result[index] = exports.clone(item);
            });
        } else {
            result = arrInside.slice();
        }

        return result;
    }


    /**
     * clone regexp
     *
     * @inner
     * @method cloneRegExp
     * @param {RegExp} regexp target regexp
     * @return {RegExp} result
     */
    function cloneRegExp(regexp) {
        var flags = '';
        flags += regexp.multiline ? 'm' : '';
        flags += regexp.global ? 'g' : '';
        flags += regexp.ignorecase ? 'i' : '';
        return new RegExp(regexp.source, flags);
    }


    /**
     * clone date
     *
     * @inner
     * @method cloneDate
     * @param {Date} date target date
     * @return {Date} result
     */
    function cloneDate(date) {
        return new Date(+date);
    }


    /**
     * clone target variable
     *
     * @method clone
     * @param {(Object | Array | RegExp | Date | string | number | boolean | HTMLElement)} source target variable
     * @return {(Object | Array | RegExp | Date | string | number | boolean | HTMLElement)} result
     */
    exports.clone = function (source) {
        switch (type.typeOf(source)) {
            case 'object':
                return cloneObject(true, source);
            case 'array':
                return cloneArray(true, source);
            case 'regexp':
                return cloneRegExp(source);
            case 'date':
                return cloneDate(source);
            case 'dom':
                return source.cloneNode();
            default:
                return source;
        }
    };


    return exports;
});
