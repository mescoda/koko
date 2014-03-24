define(function() {
    var class2type = {},
        typeName = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];

    for(var i = 0, iLen = typeName.length; i < iLen; i++) {
        class2type[ '[object ' + typeName[i] + ']' ] = typeName[i].toLowerCase();
    }

    function typeOf(obj) {
        if(obj === null) {
            return String(null);
        }
        if(typeof obj === 'object' && 'nodeType' in obj) {
            return 'dom';
        }
        if(typeof obj === 'object' || typeof obj === 'function') {
            return class2type[ Object.prototype.toString.call(obj) ] || 'object';
        } else {
            return typeof obj;
        }
    }
    function isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : typeOf(obj) === 'array';
    }
    function isArrayLike(obj) {

    }
    function isWindow(obj) {
        return obj != null && obj === obj.window;
    }
    function isNumeric(obj) {

    }
    function isObject(obj) {
        return obj === Object(obj);
    }
    function isPlainObject(obj) {

    }
    function isEmptyObject(obj) {

    }

    return {
        typeOf: typeOf,
        isArray: isArray,
        isWindow: isWindow,
        isObject: isObject
    }
});
