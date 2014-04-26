define(function() {
    var support = {},
        div = document.createElement('div');

    div.style.cssText = 'float:left;';

    support.cssFloat = !!div.style.cssFloat;

    return support;
});
