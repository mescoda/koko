define(['koko/lang/type', 'koko/lang/es5'], function(type, _) {
    var object = {},
        array = {},
        fn = {},
        string = {};

    object.values = function(obj) {
        var keys = _.object.keys(obj),
            values = [];
        for(var i = 0, iLen = keys.length; i < iLen; i++) {
            values.push( obj[keys[i]] );
        }
        return values;
    };

    object.extend = function(isDeep, prev, add) {
        if(type.typeOf(isDeep) !== 'boolean') {
            add = prev;
            prev = isDeep;
            isDeep = false;
        }
        for(var key in add) {
            if(add.hasOwnProperty(key)) {
                if(isDeep && type.isPlainObject(prev[key])) {
                    object.extend(prev[key], add[key]);
                } else {
                    prev[key] = add[key];
                }
            }
        }
        return prev;
    };

    object.clone = function(obj) {
        if(type.isArray(obj)) {
            return obj.slice();
        }
        if(type.isPlainObject(obj)) {
            return object.extend({}, obj);
        }
        return obj;
    };

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

    string.contains = function(source, searchString, seperator) {
        seperator = seperator || ' ';
        source = seperator + source + seperator;
        searchString = seperator + _.trim(searchString) + seperator;
        return source.indexOf(searchString) > -1;
    };

    string.encodeHTML = function(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    string.decodeHTML = function(str) {
        var result = String(str)
            .replace(/&quot;/g,'"')
            .replace(/&lt;/g,'<')
            .replace(/&gt;/g,'>')
            .replace(/&amp;/g, "&");
        //处理转义的中文和实体字符
        return result.replace(/&#([\d]+);/g, function(_0, _1){
            return String.fromCharCode(parseInt(_1, 10));
        });
    };

    string.escapeRegExp = function(str) {
        return String(str).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    string.camelCase = function(str) {
        return String(str).replace(
            /-([\da-z])/gi,
            function (match, letter) {
                return letter.toUpperCase();
            }
        );
    };

    return {
        object: object,
        fn: fn,
        string: string,
        extend: object.extend,
        clone: object.clone,
        uncurrying: fn.uncurrying,
        currying: fn.currying,
        escapeRegExp: string.escapeRegExp,
        camelCase: string.camelCase
    };
});
