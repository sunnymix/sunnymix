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
    ]

    var messageOps = {
        SEND: 'SEND',
        RECEIVE: 'RECEIVE'
    }

    function block(data) {
        var template = $([
            '<div class="block pt-1 px-1" style="word-break:break-all">',
            '  <div class="body bg-light p-1 rounded">',
            '  </div>',
            '</div>'
        ].join(''));
        template.find('.body').html(data);
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
        messageOutput.append(block(data));
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

        var ws = new WebSocket(connectUrl);

        function onOpen(e) {
            connectOk();
            var state = ws.readyState;
            log('Opened:<br>' + 'readyState=' + state + '-' + readyStateDic[state]);
        }

        function onMessage(e) {
            if (typeof e.data === "string") {
                logMessage(messageOps.RECEIVE, e.data);
            }

            if (e.data instanceof ArrayBuffer) {
                var blob = e.data;
                var r = new FileReader();
                r.readAsText(blob, 'utf-8');
                r.onload = function (e) {
                    logMessage(messageOps.RECEIVE, r.result);
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
                logMessage(messageOps.SEND, data);
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
