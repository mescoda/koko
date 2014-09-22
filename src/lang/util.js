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
     * @param  {boolean} isDeep should be false
     * @param  {Object}  prev   the prev object
     * @param  {Object}  adds   the to be add object1
     * @return {Object}         result
     */
    /**
     * deep extend
     * @param  {boolean} isDeep should be true
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

    /**
     * convert to pascal case
     *
     * @method toPascalCase
     * @param {string} str
     * @return {string} result
     */
    string.toPascalCase =  function (str) {
        return string.toCamelCase(str).replace(
            /^[a-z]/,
            function (match) {
                return match.toUpperCase();
            }
        );
    };

    string.toDash = function(str) {
        return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    };

    /**
     * pad source with leading character
     *
     * @method pad
     * @param  {(string|number)} source [description]
     * @param  {number} width [description]
     * @param  {string} leading [description]
     * @return {string} [description]
     */
    string.pad = function(source, width, leading) {
        var str = String(source);
        return str.length > width
                ? str
                : new Array(width - str.length + 1).join(leading) + str;
    };

    /**
     * pad number with leading zeros
     *
     * @method padZero
     * @param  {(string|number)} source [description]
     * @param  {number} width [description]
     * @return {string} [description]
     */
    string.padZero = function(source, width) {
        var str = String(Math.abs(source | 0));
        return (source < 0 ? '-' : '')
            + string.pad(str, width, '0');
    };


    /**
     * [clone description]
     * @param  {Object(plainObject)|Array|RegExp|Date|String|Number|Boolean|HTMLElement} source [description]
     * @description cannot clone {Error|Function|Null|Undefined|objects created with custom constructor}
     * @return {Object(plainObject)|Array|RegExp|Date|String|Number|Boolean|HTMLElement}        [description]
     */
    function clone(source) {
        switch(type.typeOf(source)) {
            case 'object':
                return cloneObject(true, source);
            case 'array':
                return cloneArray(true, source);
            case 'regexp':
                return cloneRegExp(source);
            case 'date':
                return cloneDate(source);
            case 'dom':
                return source.cloneNode();
            default:
                return source;
        }
    }

    /**
     * [cloneObject description]
     * cloneObject([isDeep], obj)
     * @param  {Boolean|Object} isDeep [description]
     * @param  {?Object}  obj    [description]
     * @return {Object}         [description]
     */
    function cloneObject(isDeep, obj) {
        var result = {},
            isDeepInside,
            objInside;
        if(type.typeOf(isDeep) !== 'boolean') {
            isDeepInside = false;
            objInside = isDeep;
        } else {
            isDeepInside = isDeep;
            objInside = obj;
        }
        if(type.isPlainObject(objInside)) {
            if(isDeepInside) {
                generic.forInOwn(objInside, function(value, key) {
                    result[key] = clone(value);
                });
            } else {
                generic.forInOwn(objInside, function(value, key) {
                    result[key] = value;
                });
            }
            return result;
        }
        return objInside;
    }

    /**
     * [cloneArray description]
     * cloneArray([isDeep], arr)
     * @param  {boolean|Array} isDeep [description]
     * @param  {?Array}  arr    [description]
     * @return {Array}         [description]
     */
    function cloneArray(isDeep, arr) {
        var result = [],
            isDeepInside,
            arrInside;
        if(type.typeOf(isDeep) !== 'boolean') {
            isDeepInside = false;
            arrInside = isDeep;
        } else {
            isDeepInside = isDeep;
            arrInside = arr;
        }
        if(isDeepInside) {
            _.forEach(arrInside, function(item, index) {
                result[index] = clone(item);
            });
        } else {
            result = arrInside.slice();
        }
        return result;
    }

    /**
     * [cloneRegExp description]
     * @param  {RegExp} regexp [description]
     * @return {RegExp}        [description]
     */
    function cloneRegExp(regexp) {
        var flags = '';
        flags += regexp.multiline ? 'm' : '';
        flags += regexp.global ? 'g' : '';
        flags += regexp.ignorecase ? 'i' : '';
        return new RegExp(regexp.source, flags);
    }

    /**
     * [cloneDate description]
     * @param  {Date} date [description]
     * @return {Date}      [description]
     */
    function cloneDate(date) {
        return new Date(+date);
    }

    return {
        object: object,
        fn: fn,
        string: string,
        extend: object.extend,
        escapeRegExp: string.escapeRegExp,
        toCamelCase: string.toCamelCase,
        toPascalCase: string.toPascalCase,
        toDash: string.toDash,
        clone: clone,
        padZero: string.padZero
    };
});
