
function initInput(input) {
    var focusResizing = input.data('autoinput-resize') === 'focus';
    var focus = false;
    
    function beforeResize() {
        if (focusResizing && focus) {
            input.addClass('position-absolute');
        } else {
            input.removeClass('position-absolute');
        }
    }

    function afterResize() {

    }

    function resize() {
        beforeResize();

        input.css({
            resize: 'none',
            zIndex: 1,
            lineHeight: '1.8rem',
            height: '100%'
        });

        if (!focusResizing || focus) {
            input.css('height', input.prop('scrollHeight') + 2 + 'px');
        }

        afterResize();
    }

    function cache() {
        var id = input.prop('id');
        localStorage.setItem(id, input.val());
    }

    function loadCache() {
        var id = input.prop('id');
        input.val(localStorage.getItem(id));
    }

    function process() {
        resize();
        cache();
    }

    function delayedProcess() {
        window.setTimeout(process, 0);
    }

    function onFocus() {
        focus = true;
        resize();
    }

    function onBlur() {
        focus = false;
        resize();
    }
    
    input.bind('change', process);
    input.bind('cut', delayedProcess);
    input.bind('paste', delayedProcess);
    input.bind('drop', delayedProcess);
    input.bind('keydown', delayedProcess);
    input.bind('focus', onFocus);
    input.bind('blur', onBlur);
    
    loadCache();
    resize();
}

function init() {
    $.each($('.autoinput'), function (i, input) { 
        initInput($(input));
    });
}

init();
