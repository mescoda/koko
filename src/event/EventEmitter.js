define(function() {

    function EventEmitter() {}

    EventEmitter.prototype.on = function(name, handler, context) {
        this._events = this._events || {};
        this._events[name] = this._events[name] || [];
        var event,
            events;
        events = this._events[name];
        event = {
            handler: handler,
            context: context
        };
        events.push(event);
        return this;
    };

    EventEmitter.prototype.once = function(name, handler, context) {
        var self = this;
        function temp() {
            self.remove(name, temp);
            handler.apply(this, arguments);
        }
        temp.handler = handler;
        this.on(name, temp, context);
        return this;
    };

    EventEmitter.prototype.emit = function(/*name, param1, param2...*/) {
        this._events = this._events || {};
        var name = arguments[0],
            events = this._events[name] || [],
            params = Array.prototype.slice.call(arguments, 1);
        events = Array.prototype.slice.call(events, 0);
        for(var i = 0, iLen = events.length; i < iLen; i++) {
            events[i].handler.apply(events[i].context || this, params);
        }
        return this;
    };

    EventEmitter.prototype.off = function(name, handler) {
        this._events = this._events || {};
        var events = this.events[name] || [],
            index = -1;
        if(arguments.length === 0) {
            this.events = {};
            return this;
        }
        if(arguments.length === 1) {
            this.events[name] = [];
            return this;
        }
        for(var i = 0, iLen = events.length; i < iLen; i++) {
            if(events[i].handler === handler || events[i].handler.handler === handler) {
                events.splice(i, 1);
                break;
            }
        }
        return this;
    };

    EventEmitter.prototype.bind = EventEmitter.prototype.on;
    EventEmitter.prototype.remove = EventEmitter.prototype.off;
    EventEmitter.prototype.trigger = EventEmitter.prototype.emit;

    EventEmitter.mixin = function(obj) {
        var prop = EventEmitter.prototype;
        for(var key in prop) {
            if(prop.hasOwnProperty(key)) {
                obj[key] = prop[key];
            }
        }
        return obj;
    };

    return EventEmitter;

});
