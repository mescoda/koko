define(function (require) {
    'use strict';

    /**
     * event of koko
     *
     * @exports event
     */
    var exports = {};

    var generic = require('../lang/generic');
    var _ = require('../lang/es5');
    var domD = require('../dom/data');


    var addEvent = function (elem, type, listener) {
        if (elem.addEventListener) {
            elem.addEventListener(type, listener, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, listener);
        }
    };


    var realEventHandler = function (elem, e) {
        e = e || window.event;

        // fix e.target
        // identify the element on which the event occurred
        if (!e.target) {
            e.target = e.srcElement;
        }

        // fix e.currentTarget
        // refer to the element the event handler has been attached
        if (!e.currentTarget) {
            e.currentTarget = elem;
        }

        // fix e.preventDefault
        if (!e.preventDefault) {
            e.preventDefault = function () {
                e.returnValue = false;
            };
        }

        // fix e.stopPropagation
        if (!e.stopPropagation) {
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }

        var currentTypeEvents = domD.get(elem, 'events')[e.type];


        _.forEach(currentTypeEvents, function (event) {
            event.call(elem, e);
        });

    };


    exports.on = function (elem, type, handler) {

        var elemDataPool = domD.get(elem);

        // only add event on ELEMENT_NODE or DOCUMENT_NODE or window
        // if nothing get, means elem is not above
        if (!elemDataPool) {
            return;
        }


        // get or init events object in elemDataPool
        elemDataPool.events = elemDataPool.events || {
            element: elem
        };
        var elemDataEvents = elemDataPool.events;


        var currentTypeEvents = elemDataEvents[type];

        if (!currentTypeEvents) {
            // init current type data array
            currentTypeEvents = elemDataEvents[type] = [];

            var realHandler = generic.currying(realEventHandler, elem);

            // bind the real event handler
            // and each type on the same elem, the real handler will be bind only once
            addEvent(elem, type, realHandler);
        }

        // add current handler to data pool
        currentTypeEvents.push(handler);

        // prevent memory leaks in IE
        elem = null;
    };

    exports.off = function (elem, type, handler) {

    };

    exports.trigger = function (elem, type) {

    };

    return exports;

});
