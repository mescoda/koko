define(function (require) {
    'use strict';

    /**
     * data of koko
     * used to store data fassociated with element
     *
     * @exports data
     */
    var exports = {};

    var type = require('../lang/type');
    var util = require('../lang/util');


    /**
     * key for storing id on element
     *
     * @type {string}
     */
    var DATA_KEY = '_kokoDataKey';


    /**
     * kernal data pool
     * all data are stored here
     *
     * @type {Object}
     */
    var kokoDataPool = {};


    /**
     * check is target can be set data or not
     * only ELEMENT_NODE or DOCUMENT_NODE or window can be set
     *
     * @method isElemCanBeSet
     * @param {HTMLElement} elem target element
     * @return {Boolean} result
     */
    var isElemCanBeSet = function (elem) {

        /**
         * nodeType
         *
         * @type {number}
         */
        var nodeType = elem.nodeType;

        if (nodeType === 1 || nodeType === 9 || type.isWindow(elem)) {
            return true;
        } else {
            return false;
        }

    };


    /**
     * get elem's all data object
     * if elem has not be setted before, all data is undefined, init all data as object
     *
     * @method getOrInitElemPool
     * @param {HTMLElement} elem element
     * @return {Object} elem's all data object
     */
    var getOrInitElemPool = function (elem) {
        if (!elem[DATA_KEY]) {
            /**
             * @type {number}
             */
            elem[DATA_KEY] = util.getUniqueID();
        }

        var id = elem[DATA_KEY];

        var elemPool = kokoDataPool[id] = kokoDataPool[id] || {};

        return elemPool;
    };


    /**
     * set data
     *
     * @method set
     * @param {HTMLElement} elem target element
     * @param {string} name key
     * @param {*} data value
     * @return {*} data
     */
    exports.set = function (elem, name, data) {

        if (!isElemCanBeSet(elem)) {
            throw new Error('data cannot be setted on this element');
        }

        var elemPool = getOrInitElemPool(elem);

        if (!type.isUndefined(data)) {
            elemPool[name] = data;
        }

        return data;

    };


    /**
     * get data
     * if name is not specified, return elem's all data object
     *
     * @method get
     * @param {HTMLElement} elem element
     * @param {string=} name key
     * @return {*} value
     */
    exports.get = function (elem, name) {

        if (!isElemCanBeSet(elem)) {
            throw new Error('this element cannot has data');
        }

        // if name is not specified, return elem's all data object
        if (!name) {
            return getOrInitElemPool(elem);
        }

        var id = elem[DATA_KEY];

        var elemPool = kokoDataPool[id];

        if (!id || !elemPool) {
            return;
        }

        return elemPool[name];

    };

    return exports;

});
