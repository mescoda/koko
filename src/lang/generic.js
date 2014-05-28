define(function() {
    var fn = {},
        object = {},
        array = {},
        string = {};

    var hasOwnPropertyPrototype = Object.prototype.hasOwnProperty,
        slicePrototype = Array.prototype.slice,
        toStringPrototype = Object.prototype.toString;


    /**
     * [uncurrying description]
     * @param  {Function} fn function to be uncurrying
     * @return {Function}      function after uncurrying
     */
    fn.uncurrying = function(fn) {
        return function() {
            return Function.call.apply(fn, arguments);
        };
    };

    /**
     * [currying description]
     * @param  {Function} fn function to be currying
     * @return {Function}      function after currying
     */
    fn.currying = function(fn) {
        var args = slicePrototype.call(arguments, 1);
        return function() {
            return fn.apply(this, args.concat(slicePrototype.call(arguments)));
        };
    };


    /**
     * [hasOwnProperty description]
     * @param {Object} obj object to be checked
     * @param {String} key key to be checked
     * @return {Boolean} if key is own or not
     * @demo    object.hasOwnProperty({foo: 'bar'}, 'foo')
     * @sameas Object.prototype.hasOwnProperty.call({foo: 'bar'}, 'foo')
     */
    object.hasOwnProperty = fn.uncurrying(hasOwnPropertyPrototype);

    /**
     * check IE<9 dontEnums bug
     * @type {Null|Array}
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
     * [forInOwn description]
     * @param  {Object} obj      object to be looped
     * @param  {Function} iterator iterator fn
     */
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

    /**
     * [toString description]
     * @param {*} obj [description]
     * @return {String}
     * @demo object.toString(source)
     * @sameas Object.prototype.toString.call(source)
     */
    object.toString = fn.uncurrying(toStringPrototype);


    /**
     * [slice description]
     * @param {Array} arr [description]
     * @return {Array}
     * @demo array.slice([1, 2])
     * @sameas Array.prototype.slice.call([1, 2])
     */
    array.slice = fn.uncurrying(slicePrototype);

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
