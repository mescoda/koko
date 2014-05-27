define(function() {
    var fn = {},
        object = {},
        array = {},
        string = {};

    var prototypeHasOwnProperty = Object.prototype.hasOwnProperty;


    fn.uncurrying = function(fn) {
        return function() {
            return Function.call.apply(fn, arguments);
        };
    };

    fn.currying = function(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
        };
    };


    object.hasOwnProperty = fn.uncurrying(prototypeHasOwnProperty);

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

    object.forInOwn = function(obj, iterator) {
        for(var key in obj) {
            if(object.hasOwnProperty(obj, key)) {
                iterator(obj[key], key, obj);
            }
        }
        if(dontEnums) {
            for(var i = 0, iLen = dontEnums.length; i < iLen; i++) {
                if(object.hasOwnProperty(obj, dontEnums[i])) {
                    iterator(obj[dontEnums[i]], dontEnums[i], obj);
                }
            }
        }
    };

    object.toString = fn.uncurrying(Object.prototype.toString);


    array.slice = fn.uncurrying(Array.prototype.slice);

    return {
        object: object,
        fn: fn,
        uncurrying: fn.uncurrying,
        currying: fn.currying,
        hasOwnProperty: object.hasOwnProperty,
        forInOwn: object.forInOwn,
        toString: object.toString,
        slice: array.slice
    };
});
