define(function() {
    var class2type = {},
        typeName = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];

    for(var i = 0, iLen = typeName.length; i < iLen; i++) {
        class2type[ '[object ' + typeName[i] + ']' ] = typeName[i].toLowerCase();
    }

    function typeOf(obj) {
        if(obj == null) {
            // null or undefined
            return String(obj);
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
        var length = obj.length,
            type = typeOf(obj);
        if(isWindow(obj)) {
            return false;
        }
        if(obj.nodeType === 1 && length) {
            return true;
        }
        return type === "array"
            || type !== "function"
            && ( length === 0
                || typeof length === "number" && length > 0 && ( length - 1 ) in obj
                );
    }

    function isObject(obj) {
        return obj === Object(obj);
    }

    function isPlainObject(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if( !obj
            || Object.prototype.toString.call(obj) !== '[object Object]'
            || typeOf(obj) === 'dom'
            || isWindow(obj)
        ) {
            return false;
        }

        // for: new fn
        try {
            if ( obj.constructor
                && !hasOwnProperty.call(obj, 'constructor')
                && !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')
            ) {
                return false;
            }
        } catch(e) {
            return false;
        }

        for(var key in obj) {}
        return key === undefined || hasOwnProperty.call(obj, key);
    }

    function isEmptyObject(obj) {
        for(var i in obj) {
            return false;
        }
        return true;
    }

    function isFunction(fn) {
        return typeOf(fn) === 'function';
    }

    function isElement(elem) {
        return (typeOf(elem) === 'dom') && (elem.nodeType === 1);
    }

    function isWindow(obj) {
        // should be eqeq; ie6 eqeqeq false
        return obj != null && obj == obj.window;
    }

    return {
        typeOf: typeOf,
        isArray: isArray,
        isArrayLike: isArrayLike,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isFunction: isFunction,
        isElement: isElement,
        isWindow: isWindow
    };
});
