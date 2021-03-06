(function () {
    var str = '<div class="infoPanel">\
        <div id="cadastreCalcWidget"></div>\
        <div class="info">\
            <form id="b_calc">\
                <h3>Калькулятор земельного налога</h3>\
                <p>Кадастровый номер:<br><input type="text" name="CAD_NUM" value="50:26:0110121:27" /><input type="button" value="Показать на карте" name="search" onclick="find(this);" /><br>(либо выбрать земельный участок на карте)</p>\
                <div id="infoError">\
                    <p id="errStatus">Расчет по кадастровым кварталам и районам не производится (измените масштаб карты чтобы найти ваш участок, либо введите кадастровый номер участка)</p>\
                </div>\
                <div id="infoBlock">\
                    <p>Кадастровая стоимость:<br><input type="text" name="CAD_COST" value="0" /> руб.</p>\
                    <div id="infoReestr">\
                        <p>Площадь: <b id="AREA_VALUE">0</b> кв.м.</p>\
                        <p>Дата обновления: <b id="ACTUAL_DATE"></b></p>\
                        <p>Адрес (местоположение):<br><b id="OBJECT_ADDRESS"></b></p>\
                        <p>Форма собственности:<br><b id="FORM_RIGHTS"></b></p>\
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
    function getParam() {
        var out = {},
            t = document.URL.toString(),
            arr = t.substring(t.lastIndexOf('?') + 1).split(/\&/);
        arr.map(function (it) {
            var p = it.split(/\=/); 
            out[p[0]] = p[1];
        });
        return out;
    }

    var container = document.getElementById('cadastreCalcWidget');
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 23,
        maxNativeZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });
    var param = getParam(),
        bl = param.bl || 'osm',
        cadNum = param.CAD_NUM || param.cad || param.cadNum,
        x = param.x || 36.62858426570892,
        y = param.y || 55.481092412215894,
        z = param.z || 18;

    var map = new L.Map(container, {
        layers: [],
        center: [y, x],
        zoom: z
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
        if (!_number) { return ''; }

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
        infoError = document.getElementById('infoError'),
        resultString = document.getElementById('resultString'),
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
        infoError.style.display = 'none';
    };
    if (cadNum) { form.CAD_NUM.value = cadNum; }
    var cadastreLayer = new L.Cadastre(null, {
        attribution: '&copy; <a href="http://russian-face.ru/">Widgets</a>',
        infoMode: true,
        onClick: function (ev) {
            infoBlock.style.display = 'block';
            infoError.style.display = 'none';
            var data = ev.feature;
            if (!data || !data.attrs || !data.attrs.cad_cost) {
                infoBlock.style.display = 'none';
                infoError.style.display = 'block';
                return;
            }
            resultString.style.display = 'block';
            result.innerHTML = '0';
            infoReestr.style.display = 'block';
            attr = data.attrs;

            form.CAD_NUM.value = attr.id;
            document.getElementById('AREA_VALUE').innerHTML = numberFormat(attr.area_value, { decimals: 0, thousands_sep: " " });
            form.CAD_COST.value = numberFormat(attr.cad_cost, { decimals: 2, thousands_sep: " " });
            document.getElementById('OBJECT_ADDRESS').innerHTML = attr.address || '';

            var sDate = 'не определена';
            var dt = attr.pubdate; if (typeof(dt) === 'string') { dt = dt.replace(/ /g, ''); }
            if (!dt) { dt = attr.adate; if (typeof(dt) === 'string') { dt = dt.replace(/ /g, ''); } }
            if (dt) {
                sDate = dt;
                // var attrDate = new Date(dt);
                // sDate = formatDate(attrDate.getDate(), attrDate.getMonth() + 1, attrDate.getFullYear());
            }
            document.getElementById('ACTUAL_DATE').innerHTML = sDate;
            if (attr.rights_reg) {
                var FORM_RIGHTS = {
                    '100': 'частная',
                    '200': 'публичная',
                    '300': '«частная и публичная»'
                };
                document.getElementById('FORM_RIGHTS').innerHTML = FORM_RIGHTS[attr.fp] || 'не определена';
            }
            document.getElementById('UTIL_BY_DOC').innerHTML = attr.util_by_doc || '';
        },
        imageOverlayOptions: {opacity: 0.2}
    }).addTo(map);
    var google = new L.Google();
    L.control.layers({
        OSM: osm,
        Google: google
    }, {
        Кадастр: cadastreLayer
    }, {collapsed: !L.Browser.mobile, autoZIndex: false}).addTo(map);

    map.addLayer(bl === 'osm' ? osm : google);

    map.addControl(new L.Control.gmxIcon({
        id: 'getWidget',
        text: 'Виджет',
        title: 'Получить код для вставки на свой сайт'
     }).on('click', function () {
        var url = 'http://russian-face.ru/cadastre/addWidgetCalc.js',
            c = map.getCenter(),
            z = map.getZoom(),
            bl = map.hasLayer(osm) ? 'osm' : 'google';
        url += '?z=' + z;
        url += '&x=' + c.lng;
        url += '&y=' + c.lat;
        url += '&bl=' + bl;
        if (form.CAD_NUM.value) { url += '&cad=' + form.CAD_NUM.value; }

        var str = '<div id="cadastreCalcWidget" style="width: 1080px; height: 800px;">' +
            '<script src="' + url + '"></script>' +
            '</div>';
        window.prompt('Скопируйте текст для вставки на свой сайт:', str);
     }));

    map.addControl(new L.Control.gmxIcon({
        id: 'getLink',
        text: 'Ссылка',
        title: 'Получить ссылку'
     }).on('click', function () {
        var url = 'http://russian-face.ru/cadastre/cadastreCalc.html',
            c = map.getCenter(),
            z = map.getZoom(),
            bl = map.hasLayer(osm) ? 'osm' : 'google';
        url += '?z=' + z;
        url += '&x=' + c.lng;
        url += '&y=' + c.lat;
        url += '&bl=' + bl;
        if (form.CAD_NUM.value) { url += '&cad=' + form.CAD_NUM.value; }

        window.prompt('Скопируйте текст для вставки на свой сайт:', url);
     }));
})();
