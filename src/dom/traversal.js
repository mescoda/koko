define(['koko/lang/type', 'koko/lang/es5', 'koko/lang/generic', 'koko/dom/classList'], function(type, _, generic, domC) {

    /**
     * get element by id
     * @param  {String|HTMLElement} id id
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function g(id) {
        return type.typeOf(id) === 'string' ? document.getElementById(id) : id;
    }

    /**
     * [q description]
     * @param  {String} className [description]
     * @param  {?HTMLElement} scope     [description]
     * @return {Array.<HTMLElement>}           matched elements array || empty array
     */
    function q(className, scope) {
        scope = scope || document;
        if(scope.getElementsByClassName) {
            return generic.slice(scope.getElementsByClassName(className));
        } else {
            var children = scope.getElementsByTagName('*');
            return _.filter(children, function(child) {
                return domC.hasClass(child, className);
            });
        }
    }

    /**
     * DOM walker
     * @inner
     * @param  {HTMLElement|String}  elem      element
     * @param  {?String}  start     start dom fn name
     * @param  {String}  direction direction dom fn name
     * @param  {?Function}  filterFn     filter fn
     * @param  {?Boolean} isAll     is return {Array.<HTMLElement>} or single HTMLElement
     * @return {HTMLElement|Array.<HTMLElement>|Null}      HTMLElement or HTMLElement array if found || null if not found
     */
    function walk(elem, start, direction, filterFn, isAll) {
        var element = g(elem)[start || direction],
            result = [];
        while(element) {
            if(element.nodeType ===1 && (!filterFn || filterFn(element))) {
                if(!isAll) {
                    return element;
                } else {
                    result.push(element);
                }
            }
            element = element[direction];
        }
        return isAll ? result : null;
    }

    /**
     * [children description]
     * @param  {[String|HTMLElement]} elem [description]
     * @return {Array.<HTMLElement>}      matched elements array || empty array
     */
    function children(elem) {
        return walk(elem, 'firstChild', 'nextSibling', null, true);
    }

    /**
     * get the parent of the elem
     * @param  {[type]} elem [description]
     * @return {HTMLElement|Null|document}      if parent is DocumentFragment or parent(document) or parent(document.getElementsByTagName('html')[0]) return null, if parent(document.getElementsByTagName('html')[0]) return document
     */
    function parent(elem) {
        elem = g(elem);
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    }

    /**
     * [first description]
     * @param  {[HTMLElement]} elem [description]
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function first(elem) {
        return walk(elem, 'firstChild', 'nextSibling');
    }

    /**
     * [last description]
     * @param  {[type]} elem [description]
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function last(elem) {
        return walk(elem, 'lastChild', 'previousSibling');
    }

    /**
     * [prev description]
     * @param  {[type]} elem [description]
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function prev(elem) {
        return walk(elem, null, 'previousSibling');
    }

    /**
     * [next description]
     * @param  {[type]}   elem [description]
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function next(elem) {
        return walk(elem, null, 'nextSibling');
    }

    /**
     * get the all the ancestors(up to <html>) of elem
     * @param  {[type]} elem [description]
     * @return {Array.<HTMLElement>}           matched elements array || empty array
     */
    function parents(elem) {
        return walk(elem, null, 'parentNode', null, true);
    }

    /**
     * get the most closest ancestor which match the filterFn
     * @param  {HTMLElement|String} elem     element
     * @param  {Function} filterFn filter fn
     * @param  {[type]} arg      filterFn arguments
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function getAncestorBy(elem, filterFn, arg) {
        elem = g(elem);
        while( (elem = elem.parentNode) && elem.nodeType == 1 ) {
            if( filterFn(elem, arg) ) {
                return elem;
            }
        }
        return null;
    }

    /**
     * get the most closest ancestor which has the className
     * @param  {HTMLElement|String} elem      element
     * @param  {String} className className string
     * @return {HTMLElement|Null}      HTMLElement if found || null if not found
     */
    function getAncestorByClassName(elem, className) {
        elem = g(elem);
        return getAncestorBy(elem, domC.hasClass, className);
    }

    /**
     * get all the descendants of elem
     * @param  {HTMLElement|String} elem element
     * @return {Array.<HTMLElement>}           matched elements array || empty array
     */
    function getDescendants(elem) {
        var result = [];
        elem = g(elem);
        for(elem = elem.firstChild; elem; elem = elem.nextSibling) {
            result.push(elem);
            if(elem.firstChild) {
                result = result.concat(getDescendants(elem));
            }
        }
        return result;
    }

    /**
     * get all the text descendants which has real textContent of elem
     * @param  {HTMLElement|String} elem element
     * @return {Array.<HTMLElement>}           matched elements array || empty array
     */
    function getDescendantTextNodes(elem) {
        var descendants = getDescendants(elem);
        return _.filter(descendants, function(el) {
            return el.nodeType === 3 && !el.nodeValue.match(/^(\s|\n)+$/);
        });
    }

    return {
        g: g,
        q: q,
        children: children,
        parent: parent,
        first: first,
        last: last,
        prev: prev,
        next: next,
        parents: parents,
        getAncestorBy: getAncestorBy,
        getAncestorByClassName: getAncestorByClassName,
        getDescendants: getDescendants,
        getDescendantTextNodes: getDescendantTextNodes
    };
});
