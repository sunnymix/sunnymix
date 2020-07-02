$(function () {
    var urlInput = $('#websocket-url');
    var proxyInput = $('#websocket-proxy-url');
    var cookieInput = $('#websocket-cookie');
    var connectBtn = $('#websocket-connect');
    var sendBtn = $('#websocket-send');
    var closeBtn = $('#websocket-close');
    var historyBtn = $('#websocket-history');
    var requestBody = $('#websocket-request-body');
    var collapse = 'collapse';

    var consoleOutput = $('#console-output');
    var messageOutput = $('#message-output');

    var readyStateDic = [
        'CONNECTING',
        'OPEN',
        'CLOSING',
        'CLOSED'
    ];

    var OPS = {
        SEND: 'SEND',
        RECEIVE: 'RECEIVE'
    };

    var ICONS = {
        SEND: '<i class="text-success fa fa-arrow-up"></i>',
        RECEIVE: '<i class="text-danger fa fa-arrow-down"></i>'
    };

    var CODES = {
        CloseNormalClosure: 1000,
        CloseGoingAway: 1001,
        CloseProtocolError: 1002,
        CloseUnsupportedData: 1003,
        CloseNoStatusReceived: 1005,
        CloseAbnormalClosure: 1006,
        CloseInvalidFramePayloadData: 1007,
        ClosePolicyViolation: 1008,
        CloseMessageTooBig: 1009,
        CloseMandatoryExtension: 1010,
        CloseInternalServerErr: 1011,
        CloseServiceRestart: 1012,
        CloseTryAgainLater: 1013,
        CloseTLSHandshake: 1015
    };

    function block(data, icon) {
        var template = $([
            '<div class="block pt-1 px-1" style="word-break:break-all">',
            '  <div class="d-flex bg-light p-1">',
            '    <div class="icon p-1"></div>',
            '    <div class="body p-1"></div>',
            '  </div>',
            '</div>'
        ].join(''));
        template.find('.body').html(data);
        if (icon) {
            template.find('.icon').append(icon);
        }
        return template;
    }

    function log(data) {
        data = data || '';
        if (data && data.length) {
            consoleOutput.append(block(data));
            consoleOutput[0].scrollTop = consoleOutput[0].scrollHeight;
        }
    }

    function message(messageOp, data) {
        data = data || '';
        messageOutput.append(block(data, ICONS[messageOp]));
        messageOutput[0].scrollTop = messageOutput[0].scrollHeight;
    }

    function logMessage(messageOp, data) {
        data = data || '';

        log(messageOp + ' message:<br>' + data);
        message(messageOp, data);
    }

    function connectPrepare() {
        connectBtn.prop('disabled', true);
        closeBtn.removeClass(collapse);
    }

    function connectOk() {
        connectBtn.prop('disabled', false);
        connectBtn.addClass(collapse);
        sendBtn.removeClass(collapse);
    }

    function connectClose() {
        connectBtn.prop('disabled', false);
        connectBtn.removeClass(collapse);
        sendBtn.addClass(collapse);
        closeBtn.addClass(collapse);
    }

    function connect() {
        connectPrepare();
        var url = urlInput.val().trim();
        var proxy = proxyInput.val().trim();
        var cookie = cookieInput.val().trim();

        var connectUrl = url;
        if (proxy.length > 0) {
            connectUrl = proxy
                + '?u=' + encodeURIComponent(url)
                + '&c=' + encodeURIComponent(cookie);
        }

        log('Connect:<br>' + connectUrl);

        var ws = null;

        try {
            ws = new WebSocket(connectUrl)
        } catch(err) {
            log(`Create websocket error: ${err}`);
        }

        if (!ws) {
            connectClose();
            return;
        }

        function onOpen(e) {
            connectOk();
            var state = ws.readyState;
            log('Opened:<br>' + 'readyState=' + state + '-' + readyStateDic[state]);
        }

        function onMessage(e) {
            if (typeof e.data === "string") {
                logMessage(OPS.RECEIVE, e.data);
            }

            if (e.data instanceof ArrayBuffer) {
                var blob = e.data;
                var r = new FileReader();
                r.readAsText(blob, 'utf-8');
                r.onload = function (e) {
                    logMessage(OPS.RECEIVE, r.result);
                }
            }
        }

        function closeConnection() {
            ws.close();
        }

        function onClose(e) {
            var state = ws.readyState;
            log('Close:<br>' + 'readyState=' + state + '-' + readyStateDic[state]);
            connectClose();
        }

        function sendMessage() {
            var data = requestBody.val().trim();
            if (data.length) {
                logMessage(OPS.SEND, data);
                ws.send(data);
            }
        }

        ws.onopen = onOpen;
        ws.onmessage = onMessage;
        ws.onclose = onClose;

        sendBtn.unbind('click');
        sendBtn.bind('click', sendMessage);

        closeBtn.unbind('click');
        closeBtn.bind('click', closeConnection);
    }

    function init() {
        connectBtn.on('click', connect);
    }

    init();
});
