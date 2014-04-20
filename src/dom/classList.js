define(['koko/lang/es5'], function(_) {

    var hasClassList = 'classList' in document.documentElement;

    function getClassList(elem) {
        var className = _.trim(elem.className);
        return className ? className.split(/\s+/) : [];
    }

    var hasClass = hasClassList
        ? function(elem, className) {
            return elem.classList.contains(className);
        }
        : function(elem, className) {
            var classList = getClassList(elem);
            return ( _.indexOf(classList, className) > -1 );
        };

    var addClass = hasClassList
        ? function(elem, className) {
            elem.classList.add(className);
        }
        : function(elem, className) {
            var classList = getClassList(elem);
            if(!hasClass(elem, className)) {
                classList.push(className);
                elem.className = classList.join(' ');
            }
        };

    var removeClass = hasClassList
        ? function(elem, className) {
            elem.classList.remove(className);
        }
        : function(elem, className) {
            var classList = getClassList(elem);
            var newClassList = _.filter(classList, function(item) {
                return item !== className;
            });
            elem.className = newClassList.join(' ');
        };

    var toggleClass = hasClassList
        ? function(elem, className) {
            elem.classList.toggle(className);
        }
        : function(elem, className) {
            if(hasClass(elem, className)) {
                removeClass(elem, className);
            } else {
                addClass(elem, className);
            }
        };

    return {
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass
    };
});
