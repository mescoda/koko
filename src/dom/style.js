define(['koko/lang/generic', 'koko/lang/util', 'koko/browser/support'], function (generic, util, support) {

    /**
     * show element
     *
     * @method show
     * @param  {HTMLElement} elem element
     * @param  {?string=} value value for display if needed such as block or inline-block
     * @return {HTMLElement} element
     */
    function show(elem, value) {
        elem.style.display = value || '';
        return elem;
    }

    /**
     * hide element
     *
     * @method hide
     * @param  {HTMLElement} elem element
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
     * @param  {?HTMLElement=} elem element needed if iframe
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
     * getScrollLeft
     *
     * @method getScrollLeft
     * @return {number} return the number of pixels that document has been scrolled horizontally
     */
    function getScrollLeft() {
        return 'pageXOffset' in window ? window.pageXOffset : getCompatElement().scrollLeft;
    }

    /**
     * getScrollTop
     *
     * @method getScrollTop
     * @return {number} return the number of pixels that document has been scrolled vertically
     */
    function getScrollTop() {
        return 'pageYOffset' in window ? window.pageYOffset : getCompatElement().scrollTop();
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
        return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, getViewWidth());
    }

    /**
     * get page height
     *
     * @method getPageHeight
     * @return {number} page height aka html height
     */
    function getPageHeight() {
        return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, getViewHeight());
    }

    /**
     * get the element coordinates relative to viewport
     *
     * @method getPositionInViewport
     * @param  {HTMLElement} elem element
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
     * @param  {HTMLElement} elem element
     * @return {Object} {top: number, left: number}
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
     * @param  {HTMLElement} elem element
     * @param  {string} key key  css key string, both dash and camelCase are ok. for float: float
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
     * @param  {HTMLElement} elem element
     * @param  {Object} properties properties css key-value object, for key: both dash and camelCase are ok
     */
    function setStyles(elem, properties) {
        generic.forInOwn(properties, function (value, key) {
            elem.style[util.toCamelCase(key)] = value;
        });
    }

    return {
        show: show,
        hide: hide,
        getCompatElement: getCompatElement,
        getScrollLeft: getScrollLeft,
        getScrollTop: getScrollTop,
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
