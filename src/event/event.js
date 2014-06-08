define(['koko/dom/style'], function(domS) {
    function on(elem, type, listener) {
        if(elem && elem.addEventListener) {
            elem.addEventListener(type, listener, false);
        } else if(elem && elem.attachEvent) {
            elem.attachEvent('on' + type, listener);
        }
    }

    function off(elem, type, listener) {
        if(elem && elem.removeEventListener) {
            elem.removeEventListener(type, listener, false);
        } else if(elem && elem.detachEvent) {
            elem.detachEvent('on' + type, listener);
        }
    }

    function emit(elem, type) {
        var event;
        if(document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            elem.dispatchEvent(event);
        } else {
            event = document.createEventObject();
            elem.fireEvent('on' + type, event);
        }
    }

    function getTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement;
    }

    function preventDefault(e) {
        if(e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    function stopPropagation(e) {
        if(e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }

    /**
     * [getClientX description]
     * @param  {Event} e event
     * @return {Number}   clientX
     */
    function getClientX(e) {
        var clientX = e.clientX;
        if(clientX || clientX === 0) {
            clientX -= domS.getCompatElement().clientLeft
        }
        return clientX;
    }

    /**
     * [getClientY description]
     * @param  {Event} e event
     * @return {Number}   clientY
     */
    function getClientY(e) {
        var clientY = e.clientY;
        if(clientY || clientY === 0) {
            clientY -= domS.getCompatElement().clientTop
        }
        return clientY;
    }

    /**
     * [getPageX description]
     * @param  {Event} e event
     * @return {Number}   pageX
     */
    function getPageX(e) {
        var pageX = e.pageX;
        if(!pageX && pageX !== 0) {
            pageX = getClientX(e) + domS.getCompatElement().scrollLeft;
        }
        return pageX;
    }

    /**
     * [getPageY description]
     * @param  {Event} e event
     * @return {Number}   pageY
     */
    function getPageY(e) {
        var pageY = e.pageY;
        if(!pageY && pageY !== 0) {
            pageY = getClientY(e) + domS.getCompatElement().scrollTop;
        }
        return pageY;
    }

    return {
        on: on,
        off: off,
        emit: emit,
        getTarget: getTarget,
        preventDefault: preventDefault,
        stopPropagation: stopPropagation,
        getClientX: getClientX,
        getClientY: getClientY,
        getPageX: getPageX,
        getPageY: getPageY
    };
});
