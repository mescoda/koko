define(function (require) {
    'use strict';

    /**
     * generic functions of koko
     *
     * @exports generic
     */
    var exports = {};

    exports.fn = {};
    exports.object = {};
    exports.array = {};

    var hasOwnPropertyPrototype = Object.prototype.hasOwnProperty;
    var slicePrototype = Array.prototype.slice;
    var toStringPrototype = Object.prototype.toString;


    /**
     * currying
     *
     * @method currying
     * @param {Function} func function to be curryinged
     * @return {Function} function after being curryinged
     */
    exports.currying = exports.fn.currying = function (func) {
        var receivedArgs = slicePrototype.call(arguments, 1);
        return function () {
            var args = receivedArgs.concat(slicePrototype.call(arguments));
            if (args < func.length) {
                return exports.currying(func, args);
            }
            return func.apply(this, args);
        };
    };

    /**
     * simpleCurrying
     *
     * @method simpleCurrying
     * @param {Function} func function to be curryinged
     * @return {Function} function after being curryinged
     */
    exports.simpleCurrying = exports.fn.simpleCurrying = function (func) {
        var args = slicePrototype.call(arguments, 1);
        return function () {
            return func.apply(this, args.concat(slicePrototype.call(arguments)));
        };
    };


    /**
     * uncurrying
     *
     * @method uncurrying
     * @param {Function} func funciton to be uncurryinged
     * @return {Function} function after being uncurryinged
     */
    exports.uncurrying = exports.fn.uncurrying = function (func) {
        return function () {
            return Function.prototype.call.apply(func, arguments);
        };
    };


    /**
     * hasOwnProperty
     *
     * @method hasOwnProperty
     * @example object.hasOwnProperty({foo: 'bar'}, 'foo');
     * @param {Object} obj object to be checked
     * @param {string} key key to be checked
     * @return {boolean} if key is obj's own property or not
     */
    exports.hasOwnProperty = exports.object.hasOwnProperty = exports.uncurrying(hasOwnPropertyPrototype);


    /**
     * check IE<9 dontEnums bug
     *
     * @type {?Array.<string>}
     */
    var dontEnums = {toString: null}.propertyIsEnumerable('toString')
        ? null
        : [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ];

    /**
     * forInOwn
     *
     * @method forInOwn
     * @param {Object} obj object to be looped
     * @param {Function} fn iterator function
     */
    exports.forInOwn = exports.object.forInOwn = function (obj, fn) {
        for (var key in obj) {
            if (exports.hasOwnProperty(obj, key)) {
                fn(obj[key], key, obj);
            }
        }
        if (dontEnums) {
            for (var i = 0, iLen = dontEnums.length; i < iLen; i++) {
                if (exports.hasOwnProperty(obj, dontEnums[i])) {
                    fn(obj[dontEnums[i]], dontEnums[i], obj);
                }
            }
        }
    };


    /**
     * toString
     *
     * @method toString
     * @example object.toString(source);
     * @param {*} source target to be toStringed
     * @return {string} target after being toStringed
     */
    exports.toString = exports.object.toString = exports.uncurrying(toStringPrototype);


    /**
     * slice
     *
     * @method slice
     * @example array.slice([1, 2]);
     * @param {Array} arr array to be sliced
     * @return {Array} array after being sliced
     */
    exports.slice = exports.array.slice = exports.uncurrying(slicePrototype);


    return exports;
});
