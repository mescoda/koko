define(function (require) {
    'use strict';

    /**
     * type check functions of koko
     *
     * @exports type
     */
    var exports = {};

    var class2type = {};
    var typeName = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];

    for (var i = 0, iLen = typeName.length; i < iLen; i++) {
        class2type['[object ' + typeName[i] + ']'] = typeName[i].toLowerCase();
    }


    /**
     * get the type of source
     *
     * @method typeOf
     * @param {*} source source to be checked
     * @return {string} result
     */
    exports.typeOf = function (source) {
        /* jshint ignore:start */
        if (source == null) {
            // null or undefined
            return String(source);
        }
        /* jshint ignore:end */

        if (typeof source === 'object' && 'nodeType' in source) {
            return 'dom';
        }

        if (typeof source === 'object' || typeof source === 'function') {
            return class2type[Object.prototype.toString.call(source)] || 'object';
        }

        return typeof source;
    };


    /**
     * check if source is array or not
     *
     * @method isArray
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isArray = function (source) {
        return Array.isArray ? Array.isArray(source) : exports.typeOf(source) === 'array';
    };


    /**
     * check if source is window or not
     *
     * @method isWindow
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isWindow = function (source) {
        /* jshint ignore:start */
        // should use eqeq; eqeqeq would be false in ie6
        return source != null && source == source.window;
        /* jshint ignore:end */
    };


    /**
     * isObject
     *
     * @method isObject
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isObject = function (source) {
        return source === Object(source);
    };


    /**
     * isEmptyObject
     *
     * @method isEmptyObject
     * @param {Object} obj object to be checked
     * @return {boolean} result
     */
    exports.isEmptyObject = function (obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    };


    /**
     * check if source is a plain object (created using '{}' or 'new Object') or not
     *
     * @method isPlainObject
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isPlainObject = function (source) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        if (!source
            || Object.prototype.toString.call(source) !== '[object Object]'
            || exports.typeOf(source) === 'dom'
            || exports.isWindow(source)
        ) {
            return false;
        }

        // for: new fn
        try {
            if (source.constructor
                && !hasOwnProperty.call(source, 'constructor')
                && !hasOwnProperty.call(source.constructor.prototype, 'isPrototypeOf')
            ) {
                return false;
            }
        } catch (e) {
            return false;
        }

        // to enhance the speed of for in
        // own properties will be looped first, so if last one is own, all is own
        for (var key in source) {}
        return key === undefined || hasOwnProperty.call(source, key);
    };


    /**
     * isFunction
     *
     * @method isFunction
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isFunction = function (source) {
        return exports.typeOf(source) === 'function';
    };


    /**
     * check if source is an element node or not
     *
     * @method isElement
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isElement = function (source) {
        return (exports.typeOf(source) === 'dom') && (source.nodeType === 1);
    };


    /**
     * isUndefined
     *
     * @method isUndefined
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isUndefined = function (source) {
        return source === void 0;
    };


    /**
     * isNumeric
     *
     * @method isNumeric
     * @param {*} source source to be checked
     * @return {boolean} result
     */
    exports.isNumeric = function (source) {
        return !exports.isArray(source) && source - parseFloat(source) >= 0;
    };


    return exports;
});
