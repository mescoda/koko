define(['koko/lang/util'], function(util) {
    var object = {},
        array = {};

    var uncurrying = util.fn.uncurrying;

    var toString = object.toString = uncurrying(Object.prototype.toString);
    var slice = array.slice = uncurrying(Array.prototype.slice);

    return {
        object: object,
        array: array,
        slice: slice,
        toString: toString
    };
});
