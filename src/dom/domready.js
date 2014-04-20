
(function() {
    var domready = (function() {
        var isInsideFrame = (top != self),
            eventList = [],
            loadedRegex = document.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^c|^i/,
            isDomReady = loadedRegex.test(document.readyState),
            listenerReadyHandler,
            attachReadyHandler;

        function eventsEmitter() {
            window.console && console.log('ine');
            var event;
            if(!isDomReady) {
                isDomReady = true;
                while(event = eventList.shift()) {
                    event && event();
                }
            }
        }

        function doScrollCheck() {
            window.console && console.log('do');
            try {
                document.documentElement.doScroll('left');
            } catch(e) {
                setTimeout(doScrollCheck, 10);
                return;
            }
            eventsEmitter();
        }

        if(document.addEventListener) {
            document.addEventListener('DOMContentLoaded', listenerReadyHandler = function() {
                document.removeEventListener('DOMContentLoaded', listenerReadyHandler, false);
                eventsEmitter();
            }, false);
        }

        if(document.attachEvent) {
            if(document.documentElement.doScroll && !isInsideFrame) {
                doScrollCheck();
            }
            document.attachEvent('onreadystatechange', attachReadyHandler = function() {
                if(document.readyState === 'complete') {
                    document.detachEvent('onreadystatechange', attachReadyHandler);
                    eventsEmitter();
                }
            });
        }

        return function(fn) {
            isDomReady ? fn() : eventList.push(fn);
        };

    })();

    if(typeof define === 'function' && define.amd) {
        define(function() {
            return domready;
        });
    } else {
        window.domready = domready;
    }

})();
