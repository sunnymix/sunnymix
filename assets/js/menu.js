function createMenu() {
    var text = [
        '<nav id="top-menu" class="navbar sticky-top navbar-expand-sm navbar-light bg-light">',
        '  <div class="container">',
        '    <ul class="nav">',
        '      <li class="nav-item">',
        '        <a class="nav-link" href="/">HOME</a>',
        '      </li>',
        '      <li class="nav-item">',
        '        <a class="nav-link" href="/wiki/">WIKI</a>',
        '      </li>',
        '      <li class="nav-item dropdown">',
        '        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="/" role="button">TOOL</a>',
        '        <div class="dropdown-menu">',
        '          <a class="dropdown-item" href="/tool/">TOOL</a>',
        '          <div class="dropdown-divider"></div>',
        '          <a class="dropdown-item" href="/tool/websocket/">WEBSOCKET</a>',
        '          <a class="dropdown-item" href="/tool/diff-checker/">DIFF-CHECKER</a>',
        '          <a class="dropdown-item" href="/tool/url-encode-decode/">URL-ENCODE-DECODE</a>',
        '          <a class="dropdown-item" href="/tool/encrypt/">ENCRYPT</a>',
        '        </div>',
        '      </li>',
        // '      <li class="nav-item dropdown">',
        // '        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="/storage" role="button">STORAGE</a>',
        // '        <div class="dropdown-menu">',
        // '          <a class="dropdown-item" href="/storage/">STORAGE</a>',
        // '          <div class="dropdown-divider"></div>',
        // '          <a class="dropdown-item" href="/storage/img/">IMAGE</a>',
        // '          <a class="dropdown-item" href="/storage/workspace/">WORKSPACE</a>',
        // '        </div>',
        // '      </li>',
        // '      <li class="nav-item">',
        // '        <a class="nav-link" href="/account/">ACCOUNT</a>',
        // '      </li>',
        '    </ul>',
        '  </div>',
        '</nav>'
    ].join('');
    var html = $(text);
    return html;
}

function updateMenu() {
    $('#top-menu').remove();

    var menu = createMenu();
    var bodyChildren =$('body').children();
    if (bodyChildren.length > 0) {
        $(bodyChildren[0]).before(menu);
    } else {
        $('body').append(menu);
    }
}

function init() {
    updateMenu();
}

init();
