(function () {
    var frame = document.createElement('iframe');
    frame.setAttribute('width', '100%');
    frame.setAttribute('height', '100%');
    var postfix = '';
    var scripts1 = document.getElementsByTagName("script");
    for (var i = 0; i < scripts1.length; i++) {
        var src = scripts1[i].getAttribute("src");
        if(src) {
            if(src.indexOf('addWidgetCalc.js') !== - 1) {
                var nm = src.indexOf('?');
                if(nm !== - 1) {
                    postfix = src.substr(nm);
                }
                break;
            }
        }
    }
    var src = 'http://russian-face.ru/cadastre/cadastreCalc.html' + postfix;
    frame.setAttribute('src', src);
    var fB = document.getElementById('cadastreCalcWidget');
    fB.appendChild(frame);
})();
