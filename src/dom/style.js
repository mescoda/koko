define(['koko/lang/type', 'koko/lang/generic', 'koko/lang/util', 'koko/browser/support'], function (type, generic, util, support) {

    /**
     * check if an element is hidden or not
     *
     * @method isHidden
     * @param {HTMLElement} elem element
     * @return {boolean} check result
     */
    function isHidden(elem) {
        return getStyle(elem, 'display') === 'none';
        // TODO: util.contains
    }

    /*
    HACK: body: 'block' to fix getDefaultDisplay('body') === 'none'
     */
    var defaultDisplay = {
        body: 'block'
    };

    /**
     * get element's default display value
     *
     * @method getDefaultDisplay
     * @param {string} nodeName nodeName
     * @return {string} display value
     */
    function getDefaultDisplay(nodeName) {
        nodeName = nodeName.toLowerCase();
        var display = defaultDisplay[nodeName];
        if (!display) {
            var temp = document.createElement(nodeName);
            document.body.appendChild(temp);
            var style;
            display = ( window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle(temp) ) )
                ? style.display
                : getStyle(temp, 'display');
            temp.parentNode.removeChild(temp);

            /*if (display === 'none') {
                // TODO: iframe check
            }*/

            defaultDisplay[nodeName] = display;
        }
        return display;
    }

    /**
     * show element
     *
     * @method show
     * @param {HTMLElement} elem element
     * @param {?string=} value value for display if needed such as block or inline-block
     * @return {HTMLElement} element
     */
    function show(elem, value) {
        if (elem.style.display === 'none') {
            elem.style.display = '';
        }
        if (isHidden(elem)) {
            elem.style.display = getDefaultDisplay(elem.nodeName);
        }
        return elem;
    }

    /**
     * hide element
     *
     * @method hide
     * @param {HTMLElement} elem element
     * @return {HTMLElement} element
     */
    function hide(elem) {
        elem.style.display = 'none';
        return elem;
    }

    /**
     * get root
     *
     * @method getCompatElement
     * @param {?HTMLElement=} elem element needed if iframe
     * @return {HTMLElement} root element: document.documentElement for Strict mode, document.body for Quirks mode
     */
    function getCompatElement(elem) {
        var doc = elem && elem.ownerDocument || document,
            compatMode = doc.compatMode;
        return (!compatMode || compatMode === 'CSS1Compat')
            ? doc.documentElement
            : doc.body;
    }

    /**
     * getScrollLeft of document(elem param is window or document) or element
     *
     * @method getScrollLeft
     * @param {HTMLElement=} elem window or document or element node
     * @return {number} return the number of pixels that document or element has been scrolled horizontally
     */
    function getScrollLeft(elem) {
        if (type.isWindow(elem) || type.isUndefined(elem) || elem.nodeType === 9) {
            return 'pageXOffset' in window ? window.pageXOffset : getCompatElement().scrollLeft;
        } else {
            return elem.scrollLeft;
        }
    }

    /**
     * getScrollTop of document(elem param is window or document) or element
     *
     * @method getScrollTop
     * @param {HTMLElement=} elem window or document or element node
     * @return {number} return the number of pixels that document or element has been scrolled vertically
     */
    function getScrollTop(elem) {
        if (type.isWindow(elem) || type.isUndefined(elem) || elem.nodeType === 9) {
            return 'pageYOffset' in window ? window.pageYOffset : getCompatElement().scrollTop;
        } else {
            return elem.scrollTop;
        }
    }

    /**
     * set scrollLeft to document or element
     *
     * @method setScrollLeft
     * @param {HTMLElement=} elem element
     * @param {number} value
     * @return {HTMLElement} window or target element
     */
    function setScrollLeft(elem, value) {
        if (type.typeOf(elem) === 'number') {
            value = elem;
            elem = window;
        }
        if (type.isWindow(elem) || elem.nodeType === 9) {
            window.scrollTo(value, getScrollTop());
            return window;
        } else {
            elem.scrollLeft = value;
            return elem;
        }
    }

    /**
     * set scrollTop to document or element
     *
     * @method setScrollTop
     * @param {HTMLElement=} elem element
     * @param {number} value
     * @return {HTMLElement} window or target element
     */
    function setScrollTop(elem, value) {
        if (type.typeOf(elem) === 'number') {
            value = elem;
            elem = window;
        }
        if (type.isWindow(elem) || elem.nodeType === 9) {
            window.scrollTo(getScrollLeft(), value);
            return window;
        } else {
            elem.scrollTop = value;
            return elem;
        }
    }

    /**
     * get viewport width
     *
     * @method getViewWidth
     * @return {number} viewport width
     */
    function getViewWidth() {
        return getCompatElement().clientWidth;
    }

    /**
     * get viewport height
     *
     * @method getViewHeight
     * @return {number} viewport height
     */
    function getViewHeight() {
        return getCompatElement().clientHeight;
    }


    /**
     * get page width
     *
     * @method getPageWidth
     * @return {number} page width aka html document width
     */
    function getPageWidth() {
        return Math.max(
            document.documentElement.scrollWidth, document.body.scrollWidth,
            getViewWidth()
        );
    }

    /**
     * get page height
     *
     * @method getPageHeight
     * @return {number} page height aka html height
     */
    function getPageHeight() {
        return Math.max(
            document.documentElement.scrollHeight, document.body.scrollHeight,
            getViewHeight()
        );
    }

    /**
     * get the element coordinates relative to viewport
     *
     * @method getPositionInViewport
     * @param {HTMLElement} elem element
     * @return {Object} {top: {number}, left: {number}}
     */
    function getPositionInViewport(elem) {
        var bounding = elem.getBoundingClientRect(),
            clientTop = getCompatElement().clientTop,
            clientLeft = getCompatElement().clientLeft;
        return {
            top: bounding.top - clientTop,
            left: bounding.left - clientLeft
        };
    }

    /**
     * get the element coordinates relative to document
     *
     * @method getPositionInDocument
     * @param {HTMLElement} elem element
     * @return {Object} {top: {number}, left: {number}}
     */
    function getPositionInDocument(elem) {
        var scrollTop = getScrollTop(),
            scrollLeft = getScrollLeft(),
            positionInViewport = getPositionInViewport(elem);
        return {
            top: positionInViewport.top + scrollTop,
            left: positionInViewport.left + scrollLeft
        };
    }

    /**
     * get element's position parent same as offsetParent in jQuery
     * for position: absolute return the latest position: relative|absolute|fixed
     * for position: fixed return document.documentElement aka <html>
     * for other elements return document.documentElement aka <html>
     *
     * @method getOffsetParent
     * @param {HTMLElement} elem element
     * @return {HTMLElement} parent
     */
    function getOffsetParent(elem) {
        var documentElement = window.document.documentElement;
        var positionParent = elem.offsetParent || documentElement;
        while (positionParent && positionParent.nodeName.toLowercase() !== 'html' && getStyle(positionParent, 'position') === 'static') {
            positionParent = positionParent.offsetParent;
        }
        return positionParent || documentElement;
    }

    /**
     * get position relative to the result of getOffsetParent(elem)
     *
     * @method getPositionToOffsetParent
     * @param {HTMLElement} elem element
     * @return {Object} {top: {number}, left: {number}}
     */
    function getPositionToOffsetParent(elem) {
        var offset;
        var parentOffset = {
            top: 0,
            left: 0
        };
        if (getStyle(elem, 'position') === 'fixed') {
            offset = elem.getBoundingClientRect();
        } else {
            var offsetParent = getOffsetParent(elem);
            offset = getPositionInDocument(elem);

            if (offsetParent.nodeName.toLowerCase() !== 'html') {
                parentOffset = getPositionInDocument(offsetParent);
            }

            parentOffset.top += getStyle(offsetParent, 'borderTopWidth');
            parentOffset.left += getStyle(offsetParent, 'borderLeftWidth');
        }
        return {
            top: offset.top - parentOffset.top - getStyle(elem, 'marginTop'),
            left: offset.left - parentOffset.left - getStyle(elem, 'marginLeft')
        };
    }

    /**
     * get float name
     *
     * @method getFloatName
     * @return {string} float name for getStyle
     */
    function getFloatName() {
        if (support.cssFloat) {
            return 'cssFloat';
        } else {
            return 'styleFloat';
        }
    }

    /**
     * getStyle
     *
     * @method getStyle
     * @param {HTMLElement} elem element
     * @param {string} key key  css key string, both dash and camelCase are ok. for float: float
     * @return {string} css value
     */
    function getStyle(elem, key) {
        var dashKey = util.toDash(key),
            camelKey = (dashKey === 'float' ? getFloatName() : util.toCamelCase(dashKey));

        var doc = elem.nodeType === 9
            ? elem
            : elem.ownerDocument || elem.document;

        if (elem.style[camelKey]) {
            return elem.style[camelKey];
        } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
            var styles = doc.defaultView.getComputedStyle(elem, null);
            if (styles) {
                return styles[camelKey] || styles.getPropertyValue(dashKey);
            }
        } else if (elem.currentStyle) {
            return elem.currentStyle[camelKey];
        }
        return '';
    }

    /**
     * setStyles
     *
     * @method setStyles
     * @param {HTMLElement} elem element
     * @param {Object} properties properties css key-value object, for key: both dash and camelCase are ok
     */
    function setStyles(elem, properties) {
        generic.forInOwn(properties, function (value, key) {
            elem.style[util.toCamelCase(key)] = value;
        });
    }


    /**
     * get width of element
     * for window return viewport width
     * for document return page width
     *
     * @method getWidth
     * @param {HTMLElement} elem element
     * @return {number} width number
     */
    function getWidth(elem) {
        if (type.isWindow(elem)) {
            return getViewWidth();
        }

        if (elem.nodeType === 9) {
            return getPageWidth();
        }

        return getStyle(elem, 'width');
    }

    /**
     * get height of element
     * for window return viewport height
     * for document return page height
     *
     * @method getHeight
     * @param {HTMLElement} elem element
     * @return {number} height number
     */
    function getHeight(elem) {
        if (type.isWindow(elem)) {
            return getViewHeight();
        }

        if (elem.nodeType === 9) {
            return getPageHeight();
        }

        return getStyle(elem, 'height');
    }

    return {
        show: show,
        hide: hide,
        getCompatElement: getCompatElement,
        getScrollLeft: getScrollLeft,
        getScrollTop: getScrollTop,
        setScrollLeft: setScrollLeft,
        setScrollTop: setScrollTop,
        getViewWidth: getViewWidth,
        getViewHeight: getViewHeight,
        getPageWidth: getPageWidth,
        getPageHeight: getPageHeight,
        getPositionInViewport: getPositionInViewport,
        getPositionInDocument: getPositionInDocument,
        getStyle: getStyle,
        setStyles: setStyles
    };
});
