define(function() {
    function on(elem, type, listener) {
        if(elem.addEventListener) {
            elem.addEventListener(type, listener, false);
        } else if(elem.attachEvent) {
            elem.attachEvent('on' + type, listener);
        }
    }

    function off(elem, type, listener) {
        if(elem.removeEventListener) {
            elem.removeEventListener(type, listener, false);
        } else if(elem.detachEvent) {
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

    return {
        on: on,
        off: off,
        emit: emit,
        getTarget: getTarget,
        preventDefault: preventDefault,
        stopPropagation: stopPropagation
    };
});
