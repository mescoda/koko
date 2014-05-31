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

    /**
     * extend
     * @ object.extend([isDeep], prev, add1[, addN] )
     * @return {Object}         result
     */
    /**
     * shallow extend without Bollean
     * @param  {Object} isDeep the actual prev object
     * @param  {Object}  prev   the to be add object1
     * @param  {Object}  adds   the to be add object2
     * @return {Object}         result
     */
    /**
     * shallow extend with Bollean
     * @param  {Boolean} isDeep should be false
     * @param  {Object}  prev   the prev object
     * @param  {Object}  adds   the to be add object1
     * @return {Object}         result
     */
    /**
     * deep extend
     * @param  {Boolean} isDeep should be true
     * @param  {Object}  prev   the prev object
     * @param  {Object}  adds   the to be add object1
     * @return {Object}         result
     */
    object.extend = function(isDeep, prev, adds) {
        var i,
            addNum = arguments.length,
            prevInside,
            isDeepInside;
        if(type.typeOf(isDeep) !== 'boolean') {
            i = 1;
            prevInside = isDeep;
            isDeepInside = false;
        } else {
            i = 2;
            prevInside = prev;
            isDeepInside = isDeep;
        }
        for(; i < addNum; i++) {
            var obj = arguments[i];
            if(obj) {
                generic.forInOwn(obj, function(value, key) {
                    if(value !== prevInside) {
                        if(isDeepInside && type.isPlainObject(value) && type.isPlainObject(prevInside[key])) {
                            object.extend(isDeepInside, prevInside[key], value);
                        } else {
                            prevInside[key] = value;
                        }
                    }
                });
            }
        }
        return prevInside;
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
            generic.forInOwn(source, function(value, key) {
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
