(function () {
    var str = '<div class="infoPanel">\
        <div id="cadastreCalcWidget"></div>\
        <div class="info">\
            <form id="b_calc">\
                <h3>Калькулятор земельного налога</h3>\
                <p>Кадастровый номер:<br><input type="text" name="CAD_NUM" value="50:26:0100302:41" /><input type="button" value="Показать на карте" name="search" onclick="find(this);" /></p>\
                <div id="infoBlock">\
                    <p id="recStatus">Заданный кадастровый номер не найден (попытайтесь найти ваш участок на карте, либо введите данные в ручную)</p>\
                    <p>Кадастровая стоимость:<br><input type="text" name="CAD_COST" value="0" /> руб.</p>\
                    <div id="infoReestr">\
                        <p>Площадь: <b id="AREA_VALUE">0</b> кв.м.</p>\
                        <p>Дата обновления: <b id="ACTUAL_DATE"></b></p>\
                        <p>Адрес (местоположение):<br><b id="OBJECT_ADDRESS"></b></p>\
                        <p>Вид разрешенного использования:<br><b id="UTIL_BY_DOC"></b></p>\
                    </div>\
                    <p>Налоговая ставка:<br><input type="text" name="prc" value="0.3" style="width: 30px;" />%<br>(уточнить ставку можно <a href="https://www.nalog.ru/rn50/service/tax/" target="_blank">тут</a>)</p>\
                    <input type="button" value="Рассчитать" name="calcButton" />\
                    <p id="resultString">Величина налога:<br><b id="result">0</b> руб.</p>\
                </div>\
            </form>\
            <div id="reclamBlock">\
            </div>\
            <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\
            <!-- For maps -->\
            <ins class="adsbygoogle"\
                 style="display:inline-block;width:320px;height:100px"\
                 data-ad-client="ca-pub-3088886844438889"\
                 data-ad-slot="8884609976"></ins>\
            <script>\
            (adsbygoogle = window.adsbygoogle || []).push({});\
            </script>\
        </div>\
    </div>';

    document.writeln(str);
    var container = document.getElementById('cadastreCalcWidget');
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 23,
        maxNativeZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });
    var map = new L.Map(container, {
        layers: [osm],
        center: [55.42047282577754, 36.60383552312851],
        zoom: 18
    });
    var attr = {};
    var STR_PAD_LEFT = 1;
    var STR_PAD_RIGHT = 2;
    var STR_PAD_BOTH = 3;

    function strpad(str, len, pad, dir) {
        if (typeof (len) == "undefined") { var len = 0; }
        if (typeof (pad) == "undefined") { var pad = ' '; }
        if (typeof (dir) == "undefined") { var dir = STR_PAD_RIGHT; }
        if (len + 1 >= str.length) {
            switch (dir) {
                case STR_PAD_LEFT:
                    str = Array(len + 1 - str.length).join(pad) + str;
                    break;
                case STR_PAD_BOTH:
                    var right = Math.ceil((padlen = len - str.length) / 2);
                    var left = padlen - right;
                    str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                    break;
                default:
                    str = str + Array(len + 1 - str.length).join(pad);
                    break;
            }
        }
        return str;
    };
    function formatDate(d, m, y) {
        return strpad(d.toString(), 2, '0', 1) + '.' + strpad(m.toString(), 2, '0', 1) + '.' + strpad(y.toString(), 4, '0', 1);
    }

    function numberFormat(_number, _cfg) {

        function obj_merge(obj_first, obj_second) {
            var obj_return = {};
            for (var key in obj_first) {
                if (typeof obj_second[key] !== 'undefined') obj_return[key] = obj_second[key];
                else obj_return[key] = obj_first[key];
            }
            return obj_return;
        };

        function thousands_sep(_num, _sep) {
            if (_num.length <= 3) return _num;
            var _count = _num.length;
            var _num_parser = '';
            var _count_digits = 0;
            for (var _p = (_count - 1) ; _p >= 0; _p--) {
                var _num_digit = _num.substr(_p, 1);
                if (_count_digits % 3 == 0 && _count_digits != 0 && !isNaN(parseFloat(_num_digit))) _num_parser = _sep + _num_parser;
                _num_parser = _num_digit + _num_parser;
                _count_digits++;
            }
            return _num_parser;
        };

        if (typeof _number !== 'number') {
            _number = parseFloat(_number);
            if (isNaN(_number)) return CALCULATING;
        }

        var _cfg_default = { before: '', after: '', decimals: 2, dec_point: '.', thousands_sep: ',' };
        if (_cfg && typeof _cfg === 'object') {
            _cfg = obj_merge(_cfg_default, _cfg);
        }
        else _cfg = _cfg_default;
        _number = _number.toFixed(_cfg.decimals);
        if (_number.indexOf('.') != -1) {
            var _number_arr = _number.split('.');
            var _number = thousands_sep(_number_arr[0], _cfg.thousands_sep) + _cfg.dec_point + _number_arr[1];
        }
        else var _number = thousands_sep(_number, _cfg.thousands_sep);

        return _cfg.before + _number + _cfg.after;
    };
    var form = document.getElementById('b_calc'),
        infoBlock = document.getElementById('infoBlock'),
        resultString = document.getElementById('resultString'),
        recStatus = document.getElementById('recStatus'),
        infoReestr = document.getElementById('infoReestr'),
        result = document.getElementById('result');
    form.calcButton.onclick = function () {
        var prc = Number(form.prc.value.replace(/ /g, '')),
            cost = Number(form.CAD_COST.value.replace(/ /g, ''));

        result.innerHTML = numberFormat(cost * prc / 100, { decimals: 2, thousands_sep: " " });
        resultString.style.display = 'block';
        
    };
    form.search.onclick = function () {
        cadastreLayer.info.cadastreSearch(form.CAD_NUM.value);
    };
    form.CAD_NUM.onfocus = function () {
        recStatus.style.display = 'none';
    };
    var cadastreLayer = new L.Cadastre(null, {
        attribution: '&copy; <a href="http://russian-face.ru/">Widgets</a>',
        infoMode: true,
        onClick: function (ev) {
            infoBlock.style.display = 'block';
            resultString.style.display = 'block';
            recStatus.style.display = 'block';
            result.innerHTML = '0';
            var data = ev.features[0];
            if (!data) {
                return;
            }
            recStatus.style.display = 'none';
            infoReestr.style.display = 'block';
            attr = data.attributes;
            var attrDate = new Date(attr.ACTUAL_DATE);

            form.CAD_NUM.value = attr.CAD_NUM;
            document.getElementById('AREA_VALUE').innerHTML = numberFormat(attr.AREA_VALUE, { decimals: 0, thousands_sep: " " });
            form.CAD_COST.value = numberFormat(attr.CAD_COST, { decimals: 2, thousands_sep: " " });
            document.getElementById('OBJECT_ADDRESS').innerHTML = attr.OBJECT_ADDRESS;
            document.getElementById('ACTUAL_DATE').innerHTML = formatDate(attrDate.getDate(), attrDate.getMonth() + 1, attrDate.getFullYear());
            document.getElementById('UTIL_BY_DOC').innerHTML = attr.UTIL_BY_DOC;
        },
        imageOverlayOptions: {opacity: 0.2}
    }).addTo(map);

    L.control.layers({
        OSM: osm,
        Google: new L.Google()
    }, {
        Кадастр: cadastreLayer
    }, {collapsed: true, autoZIndex: false}).addTo(map);

    map.addControl(new L.Control.gmxIcon({
        id: 'getWidget',
        text: 'Виджет',
        title: 'Получить код для вставки на свой сайт'
     }).on('click', function () {
        var str = '<div id="cadastreCalcWidget" style="width: 1080px; height: 800px;">' +
            '<script src="http://russian-face.ru/cadastre/addWidgetCalc.js"></script>' +
            '</div>';
        window.prompt('Скопируйте текст для вставки на свой сайт:', str);
     }));
})();
