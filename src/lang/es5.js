define(function() {
    var json = {},
        object = {},
        array = {},
        fn = {},
        string = {};

    var objectPrototype = Object.prototype,
        functionPrototype = Function.prototype,
        stringPrototype = String.prototype,
        arrayPrototype = Array.prototype;

    // json
    json.parse = function(str) {
        if(window.JSON && window.JSON.parse) {
            return window.JSON.parse(str);
        }
        if(str && typeof str === 'string') {
            return (new Function("return (" + str + ")"))();
        }
        return null;
    }
    json.stringify = function(obj) {
        if(window.JSON && window.JSON.stringify) {
            return window.JSON.stringify(obj);
        }
    };

    // object
    object.keys = function(obj) {
        if(Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };

    object.getPrototypeOf = function(obj) {
        var getPrototypeOfProto = objectPrototype.getPrototypeOf;
        if(getPrototypeOfProto) {
            return getPrototypeOfProto.call(obj);
        } else {
            return obj.__proto__ || obj.constructor.prototype;
        }
    };

    // function
    fn.bind = function(fn, context) {
        var bindProto = functionPrototype.bind,
            bindArgs = arrayPrototype.slice.call(arguments, 2),
            newObj = function() {},
            bound;
        if(bindProto) {
            return bindProto.apply(fn, arrayPrototype.slice.call(arguments, 1));
        } else {
            bound = function() {
                var args = bindArgs.concat( arrayPrototype.slice.call(arguments) ),
                    newInstance,
                    result;
                if(!(this instanceof bound)) {
                    return fn.apply(context, args);
                }
                newObj.prototype = fn.prototype;
                newInstance = new newObj;
                result = fn.apply(newInstance, args);
                if(Object(result) === result) {
                    return result;
                }
                return newInstance;
            };
            return bound;
        }
    };

    // string
    string.trim = function(str) {
        var trimRegex = /^[\s\xA0\u3000\uFEFF]+|[\s\xA0\u3000\uFEFF]+$/g,
            trimProto = stringPrototype.trim;
        if(trimProto) {
            return str == null ? '' : trimProto.call(str);
        }
        return str == null ? '' : String(str).replace(trimRegex, '');
    };

    // array
    array.indexOf = function(array, item, fromIndex) {
        var indexOfProto = arrayPrototype.indexOf,
            length = array.length,
            i;
        if(length === 0) {
            return -1;
        }
        fromIndex = +fromIndex || 0;
        i = fromIndex < 0 ? Math.max(0, fromIndex + length) : fromIndex;
        if(indexOfProto) {
            return indexOfProto.call(array, item, i);
        }
        for(; i < length; i++) {
            if(i in array && array[i] === item) {
                return i;
            }
        }
        return -1;
    };

    array.lastIndexOf = function(array, item, fromIndex) {
        var lastIndexOfProto = arrayPrototype.lastIndexOf,
            length = array.length,
            i;
        if(length === 0) {
            return -1;
        }
        // not a number or gt length
        fromIndex = Math.min(+fromIndex || length - 1, length - 1);
        i = fromIndex < 0 ? fromIndex + length : fromIndex;
        if(lastIndexOfProto) {
            return lastIndexOfProto.call(array, item, i);
        }
        for(; i > -1; i--) {
            if(i in array && array[i] === item) {
                return i;
            }
        }
        return -1;
    };

    array.forEach = function(arr, iterator, context) {
        var forEachProto = arrayPrototype.forEach;
        if(forEachProto) {
            forEachProto.call(arr, iterator, context);
        } else {
            for(var i = 0, iLen = arr.length; i < iLen; i++) {
                if(i in arr) {
                    iterator.call(context, arr[i], i, arr);
                }
            }
        }

    };

    array.map = function(arr, iterator, context) {
        var mapProto = arrayPrototype.map,
            result = [];
        if(mapProto) {
            return mapProto.call(arr, iterator, context);
        }
        for(var i = 0, iLen = arr.length; i < iLen; i++) {
            if(i in arr) {
                result[i] = (iterator.call(context, arr[i], i, arr));
            }
        }
        return result;
    };

    array.filter = function(arr, iterator, context) {
        var filterProto = arrayPrototype.filter,
            result = [];
        if(filterProto) {
            return filterProto.call(arr, iterator, context);
        }
        for(var i = 0, iLen = arr.length; i < iLen; i++) {
            if(i in arr && iterator.call(context, arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    };

    array.every = function(arr, iterator, context) {
        var everyProto = arrayPrototype.every;
        if(everyProto) {
            return everyProto.call(arr, iterator, context);
        }
        for(var i = 0, iLen = arr.length; i < iLen; i++) {
            if(i in arr && !iterator.call(context, arr[i], i, arr)) {
                return false;
            }
        }
        return true;
    };

    array.some = function(arr, iterator, context) {
        var someProto = arrayPrototype.some;
        if(someProto) {
            return someProto.call(arr, iterator, context);
        }
        for(var i = 0, iLen = arr.length; i < iLen; i++) {
            if(i in arr && iterator.call(context, arr[i], i, arr)) {
                return true;
            }
        }
        return false;
    };

    array.reduce = function(arr, iterator, initialValue) {
        var reduceProto = arrayPrototype.reduce,
            prev,
            i,
            length = arr.length,
            setPrev = false;
        if(reduceProto) {
            return initialValue ? reduceProto.call(arr, iterator, initialValue) : reduceProto.call(arr, iterator);
        }
        if(!initialValue && length === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        if(initialValue) {
            prev = initialValue;
            setPrev = true;
        }
        for(i = 0; i < length; i++) {
            if(i in arr) {
                if(setPrev) {
                    prev = iterator.call(arr, prev, arr[i], i, arr);
                } else {
                    prev = arr[i]
                    setPrev = true;
                }
            }
        }
        return prev;
    };

    return {
        json: json,
        object: object,
        array: array,
        fn: fn,
        string: string,
        trim: string.trim,
        indexOf: array.indexOf,
        lastIndexOf: array.lastIndexOf,
        filter: array.filter,
        forEach: array.forEach,
        bind: fn.bind
    };
});
