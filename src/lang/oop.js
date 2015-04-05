define(function (require) {
    // cannot use strict, because of using arguments.callee.caller to implement $super

    /**
     * oop of koko
     *
     * @exports oop
     */
    var exports = {};

    var type = require('./type');
    var generic = require('./generic');
    var _ = require('./es5');


    /**
     * the property name linked to it's owner class on prototype method
     *
     * @type {string}
     */
    var OWNER_CLASS_LINK_NAME = '_ownerClass';


    /**
     * BaseClass of all class created by createClass
     * @class
     */
    var BaseClass = function () {};

    /**
     * call parent method
     *
     * @method $super
     * @param {string} name method name
     * @param {...*} args arguments when called parent class method
     */
    BaseClass.prototype.$super = function(name, args) {
        var caller = arguments.callee.caller;
        var ownerClass = caller[OWNER_CLASS_LINK_NAME];
        var parentClassPrototype = ownerClass._super_;
        var parentMethod = parentClassPrototype[name];
        if (type.typeOf(parentMethod) === 'function') {
            return parentMethod.apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (name === 'initialize' && parentClassPrototype.constructor
            && type.typeOf(parentClassPrototype.constructor) === 'function') {
            // for cases: using $super('initialize') to call a parent class which is not created by createClass
            return parentClassPrototype.constructor.apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            throw new Error('no ' + name + ' method fould');
        }
    };

    /**
     * createClass
     *
     * @method createClass
     * @param {Function=} superClassArg superClass constructor aka parent class constructor
     * @param {Object} prototypeArg prototype methods
     * @return {Function} new Class constructor
     */
    exports.createClass = function (superClassArg, prototypeArg) {
        var superClass;
        var prototype;

        if (!prototypeArg) {
            superClass = BaseClass;
            prototype = superClassArg;
        } else {
            superClass = superClassArg;
            prototype = prototypeArg;
        }

        /**
         * Class constructor
         * constructor of all Classes created by createClass method
         *
         * @class
         */
        // in order to help debug in stack, named it _kokoClassConstructor
        // pay attention that _kokoClassConstructor would be leaked into the enclosing scope in browsers <= IE8
        var Class = function _kokoClassConstructor() {
            var result;
            if (this.initialize) {
                result = this.initialize.apply(this, arguments);
            } else {
                result = this;
            }
            // if result is an Object, the instance will be it after new
            return result;
        };

        Class.prototype = _.create(superClass.prototype);
        Class.prototype.constructor = Class;

        // link to parent class' prototype on current class
        Class._super_ = superClass.prototype;

        // if has no $super in prototype
        // for cases: using createClass to inherit a class not created by createClass
        if (!('$super' in Class.prototype)) {
            Class.prototype.$super = BaseClass.prototype.$super;
        }

        generic.forInOwn(prototype, function (value, key) {
            Class.prototype[key] = value;
            if (type.typeOf(value) === 'function') {
                Class.prototype[key][OWNER_CLASS_LINK_NAME] = Class;
            }
        });

        return Class;
    };


    /**
     * make subClass inherit from superClass
     *
     * @method inherit
     * @param {Function} subClass subClass's constructor
     * @param {Function} superClass superClass's constructor
     */
    exports.inherit = function (subClass, superClass) {
        var oriPrototype = subClass.prototype;

        subClass.prototype = _.create(superClass.prototype);

        generic.forInOwn(oriPrototype, function (value, key) {
            subClass.prototype[key] = value;
        });

        subClass.prototype.constructor  = subClass;

        return subClass;
    };

    return exports;
});
