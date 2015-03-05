define(function (require) {
    'use strict';

    /**
     * es5 functions of koko
     *
     * @exports es5
     */
    var exports = {};

    exports.json = {};
    exports.object = {};
    exports.array = {};
    exports.fn = {};
    exports.string = {};

    var generic = require('./generic');

    var functionPrototype = Function.prototype;
    var stringPrototype = String.prototype;
    var arrayPrototype = Array.prototype;


    /**
     * json.parse
     *
     * @method parse
     * @param {string} str target string
     * @return {*} result
     */
    exports.json.parse = function (str) {
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(str);
        }
        if (str && typeof str === 'string') {
            return (new Function('return (' + str + ')'))();
        }
        return null;
    };


    /**
     * get keys of an object
     *
     * @method keys
     * @param {Object} obj object to be got
     * @return {Array.<string>} the keys
     */
    exports.keys = exports.object.keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }

        var keys = [];
        generic.forInOwn(obj, function (value, key) {
            keys.push(key);
        });
        return keys;
    };


    /**
     * simple recreate for Object.create
     *
     * @method create
     * @param {Object} obj target object
     * @return {Object}
     */
    exports.create = exports.object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };


    /**
     * recreate of Function.prototype.bind
     *
     * @method bind
     * @param {Function} fn function to be bound
     * @param {Object} context the context
     * @return {Function} function after being bound
     */
    exports.bind = exports.fn.bind = function (fn, context) {
        var bindProto = functionPrototype.bind;

        if (bindProto) {
            return bindProto.apply(fn, arrayPrototype.slice.call(arguments, 1));
        }

        var bindArgs = arrayPrototype.slice.call(arguments, 2);
        var Temp = function () {};
        var boundFn = function () {
            var args = bindArgs.concat(arrayPrototype.slice.call(arguments));
            if (!(this instanceof boundFn)) {
                return fn.apply(context, args);
            }

            Temp.prototype = fn.prototype;
            var newInstance = new Temp();
            var result = fn.apply(newInstance, args);
            if (Object(result) === result) {
                return result;
            }
            return newInstance;
        };
        return boundFn;
    };


    /**
     * recreate of String.prototype.trim
     *
     * @method trim
     * @param {string} str string to be trimed
     * @return {string} string after being trimed
     */
    exports.trim = exports.string.trim = function (str) {
        var trimProto = stringPrototype.trim;

        /* jshint eqeqeq: false */
        if (str == null) {
        /* jshint eqeqeq: true */
            return '';
        }

        var trimRegex = /^[\s\xA0\u3000\uFEFF]+|[\s\xA0\u3000\uFEFF]+$/g;

        return trimProto ? trimProto.call(str) : String(str).replace(trimRegex, '');
    };


    /**
     * recreate of Array.prototype.indexOf
     *
     * @method indexOf
     * @param {Array} array target array
     * @param {*} item item to be checked
     * @param {number=} fromIndex the fromIndex
     * @return {number} if found return the index of item else return -1
     */
    exports.indexOf = exports.array.indexOf = function (array, item, fromIndex) {
        var indexOfProto = arrayPrototype.indexOf;

        if (indexOfProto) {
            return indexOfProto.call(array, item, fromIndex);
        }

        var length = array.length;
        if (length === 0) {
            return -1;
        }

        fromIndex = +fromIndex || 0;

        var i = fromIndex < 0 ? Math.max(0, fromIndex + length) : fromIndex;

        for (; i < length; i++) {
            if (i in array && array[i] === item) {
                return i;
            }
        }
        return -1;
    };


    /**
     * recreate of Array.prototype.lastIndexOf
     *
     * @method lastIndexOf
     * @param {Array} array target array
     * @param {*} item item to be checked
     * @param {number=} fromIndex the fromIndex
     * @return {number} if found return the last index of item else return -1
     */
    exports.lastIndexOf = exports.array.lastIndexOf = function (array, item, fromIndex) {
        var lastIndexOfProto = arrayPrototype.lastIndexOf;
        var length = array.length;

        if (length === 0) {
            return -1;
        }

        // not a number or gt length
        fromIndex = Math.min(+fromIndex || length - 1, length - 1);

        var i = fromIndex < 0 ? fromIndex + length : fromIndex;

        if (lastIndexOfProto) {
            return lastIndexOfProto.call(array, item, i);
        }

        for (; i > -1; i--) {
            if (i in array && array[i] === item) {
                return i;
            }
        }
        return -1;
    };


    /**
     * recreate of Array.prototype.forEach
     *
     * @method forEach
     * @param {Array} arr target array
     * @param {Function} iterator the iterator function
     * @param {Object=} context iterator context
     */
    exports.forEach = exports.array.forEach = function (arr, iterator, context) {
        var forEachProto = arrayPrototype.forEach;

        if (forEachProto) {
            forEachProto.call(arr, iterator, context);
        } else {
            for (var i = 0, iLen = arr.length; i < iLen; i++) {
                if (i in arr) {
                    iterator.call(context, arr[i], i, arr);
                }
            }
        }
    };


    /**
     * recreate of Array.prototype.map
     *
     * @method map
     * @param {Array} arr target array
     * @param {Function} iterator the iterator function
     * @param {Object=} context iterator context
     */
    exports.map = exports.array.map = function (arr, iterator, context) {
        var mapProto = arrayPrototype.map;

        if (mapProto) {
            return mapProto.call(arr, iterator, context);
        }

        var result = [];
        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            if (i in arr) {
                result[i] = (iterator.call(context, arr[i], i, arr));
            }
        }
        return result;
    };


    /**
     * recreate of Array.prototype.filter
     *
     * @method filter
     * @param {Array} arr target array
     * @param {Function} iterator the iterator function
     * @param {Object=} context iterator context
     */
    exports.filter = exports.array.filter = function (arr, iterator, context) {
        var filterProto = arrayPrototype.filter;

        if (filterProto) {
            return filterProto.call(arr, iterator, context);
        }

        var result = [];
        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            if (i in arr && iterator.call(context, arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    };


    /**
     * recreate of Array.prototype.every
     *
     * @method every
     * @param {Array} arr target array
     * @param {Function} iterator the iterator function
     * @param {Object=} context iterator context
     */
    exports.every = exports.array.every = function (arr, iterator, context) {
        var everyProto = arrayPrototype.every;

        if (everyProto) {
            return everyProto.call(arr, iterator, context);
        }

        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            if (i in arr && !iterator.call(context, arr[i], i, arr)) {
                return false;
            }
        }
        return true;
    };


    /**
     * recreate of Array.prototype.some
     *
     * @method some
     * @param {Array} arr target array
     * @param {Function} iterator the iterator function
     * @param {Object=} context iterator context
     */
    exports.some = exports.array.some = function (arr, iterator, context) {
        var someProto = arrayPrototype.some;

        if (someProto) {
            return someProto.call(arr, iterator, context);
        }

        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            if (i in arr && iterator.call(context, arr[i], i, arr)) {
                return true;
            }
        }
        return false;
    };


    /**
     * recreate of Array.prototype.reduce
     *
     * @method reduce
     * @param {Array} arr target array
     * @param {Function} iterator the iterator function
     * @param {*} initialValue initialValue
     */
    exports.reduce = exports.array.reduce = function (arr, iterator, initialValue) {
        var reduceProto = arrayPrototype.reduce;

        if (reduceProto) {
            return initialValue ? reduceProto.call(arr, iterator, initialValue) : reduceProto.call(arr, iterator);
        }

        var length = arr.length;
        if (!initialValue && length === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }

        var prev;
        var setPrev = false;
        if (initialValue) {
            prev = initialValue;
            setPrev = true;
        }

        for (var i = 0; i < length; i++) {
            if (i in arr) {
                if (setPrev) {
                    prev = iterator.call(arr, prev, arr[i], i, arr);
                } else {
                    prev = arr[i];
                    setPrev = true;
                }
            }
        }
        return prev;
    };

    return exports;
});
