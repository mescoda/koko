define(function() {

    function insertBefore(newElem, existElem) {
        if(existElem) {
            var parent = existElem.parentNode;
            parent && parent.insertBefore(newElem, existElem);
        }
    }

    function insertAfter(newElem, existElem) {
        if(existElem) {
            var parent = existElem.parentNode;
            parent && parent.insertBefore(newElem, existElem.nextSibling);
        }
    }

    function append(newElem, parent) {
        if(parent && (parent.nodeType === 1 || parent.nodeType === 9 || parent.nodeType === 11)) {
            parent.appendChild(newElem);
        }
    }

    function prepend(newElem, parent) {
        if(parent && (parent.nodeType === 1 || parent.nodeType === 9 || parent.nodeType === 11)) {
            parent.insertBefore(newElem, parent.firstChild);
        }
    }

    function empty(elem) {
        while(elem && elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }

    function remove(elem) {
        if(elem) {
            var parent = elem.parentNode;
            parent && parent.removeChild(elem);
        }
    }

    return {
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        append: append,
        prepend: prepend,
        empty: empty,
        remove: remove
    };
});
