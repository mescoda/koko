define(function() {

    function isValidKey(name) {
        return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(name);
    }

    /**
     * set cookie
     * @param {String} name    cookie name
     * @param {String} value   cookie value
     * @param {Object} options cookie set options
     */
    function set(name, value, options) {
        /**
         * [options description]
         * @type {Object}
         * @property {String} path cookie path
         * @property {String} domain cookie domain
         * @property {Number} maxDay cookie max day
         * @property {Date} expires cookie expire GMTString
         * @property {Number} max-age cookie max-age in seconds
         * @property {Boolean} secure cookie to only be transmitted over secure protocol as https
         */
        options = options || {};

        if(!isValidKey(name)) {
            return;
        }

        var content = name + '=' + encodeURIComponent(value),
            domain = options.domain ? '; domain=' + options.domain : '',
            path = options.path ? '; path=' + options.path : '',
            expires = '',
            secure = options.secure ? '; secure' : '';

        if(options.maxDay) {
            expires = '; expires=' + new Date( (1000 * 60 * 60 * 24) * options.maxDay + (+new Date) ).toUTCString();
        } else if(options.expires) {
            expires = '; expires=' + options.expires;
        } else if(options['max-age']) {
            expires = '; expires=' + new Date( options['max-age'] * 1000 + (+new Date) ).toUTCString();
        }

        document.cookie = [content, domain, path, expires, secure].join('');
    }

    function get(name) {
        var cookieArray = document.cookie.split('; '),
            singleContent,
            singleName,
            singleValue;

        for(var i = 0, iLen = cookieArray.length; i < iLen; i++) {
            var singleContent = cookieArray[i].split('='),
                singleName = singleContent[0],
                singleValue = singleContent[1];
            if(singleName === name) {
                return decodeURIComponent(singleValue);
            }
        }

        return null;
    }

    function remove(name) {
        set(name, '', {
            maxDay: '-1'
        });
    }

    return {
        set: set,
        get: get,
        remove: remove
    };
});
