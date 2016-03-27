(function () {
    var str = '<div class="recUsl">\
        Условия размещения <a href="http://russian-face.ru/cadastre/reclama.html">рекламы</a>.\
    </div>';
    var cont = document.getElementById('reclamBlock'),
        delay = 20000,
        arr = [
            // 'Блала &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>'
        ],
        len = arr.length,
        setRec = function () {
            var out = str;
            if (len) {
                var cur = Math.round((len - 1) * Math.random());
                out += '<div class="recItem">' + arr[cur] + '</div>';
            }
            cont.innerHTML = out;
        };

    setInterval(setRec, delay);
    setRec();
})();
