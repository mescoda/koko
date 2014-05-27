define(['koko/lang/type', 'koko/lang/generic', 'koko/lang/es5'], function(type, generic, _) {
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

    string.toCamelCase = function(str) {
        return String(str).replace(
            /-([\da-z])/gi,
            function (match, letter) {
                return letter.toUpperCase();
            }
        );
    };

    string.toDash = function(str) {
        return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    };


    /**
     * [clone description]
     * @param  {*} source can be String Number Array Object...
     * @return {*}        cloned source
     */
    var clone = function(source) {
        var result = source;
        if(type.isArray(source)) {
            result = source.slice();
        } else if(type.isPlainObject(source)) {
            result = {};
            generic.forIn(source, function(value, key) {
                result[key] = clone(value);
            });
        }
        return result;
    };

    return {
        object: object,
        fn: fn,
        string: string,
        extend: object.extend,
        escapeRegExp: string.escapeRegExp,
        toCamelCase: string.toCamelCase,
        toDash: string.toDash,
        clone: clone
    };
});
