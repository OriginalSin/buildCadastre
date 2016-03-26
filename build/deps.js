var depsJS = [
    "external/leaflet/leaflet.js",

    "external/Leaflet-GeoMixer/src/Deferred.js",
    "external/Leaflet-GeoMixer/src/gmxAPIutils.js",

    "external/L.Cadastre/src/L.ImageOverlay.Pane.js",
    "external/L.Cadastre/src/L.Cadastre.js",
    "external/L.Cadastre/src/L.Cadastre.Info.js",

    "external/gmxControls/src/js/gmxPosition.js",
    "external/gmxControls/src/js/gmxControlsManager.js",
    "external/gmxControls/src/js/L.Control.gmxIcon.js",
    "external/gmxControls/src/js/L.Control.gmxIconGroup.js",
    "external/gmxControls/src/js/L.Control.gmxDrawing.js", 
    "external/gmxControls/src/locale/L.Control.gmxDrawing.locale.ru.js",
    "external/gmxControls/src/locale/L.Control.gmxDrawing.locale.en.js",
    "external/gmxControls/src/js/L.Control.gmxCenter.js",
    "external/gmxControls/src/js/L.Control.gmxHide.js",
    "external/gmxControls/src/js/L.Control.gmxLayers.js",
    "external/gmxControls/src/js/L.Control.gmxSidebar.js",
    "external/gmxControls/src/js/L.Control.gmxLogo.js"
    ,
    "external/gmxDrawing/src/L.GmxDrawing.js"
];
var depsCSS = [
    "external/L.Cadastre/src/L.Cadastre.css",
    "external/leaflet/leaflet.css",

    "external/gmxControls/src/css/L.Control.gmxIcon.css",
    "external/gmxControls/src/css/L.Control.gmxIconGroup.css",
    "external/gmxControls/src/css/L.Control.gmxDrawing.css",
    "external/gmxControls/src/css/L.Control.gmxCenter.css",
    "external/gmxControls/src/css/L.Control.gmxHide.css",
    "external/gmxControls/src/css/L.Control.gmxLayers.css",
    "external/gmxControls/src/css/L.Control.gmxLocation.css",
    "external/gmxControls/src/css/L.Control.gmxCopyright.css",
    "external/gmxControls/src/css/L.Control.gmxZoom.css",
    "external/gmxControls/src/css/L.Control.gmxBottom.css",
    "external/gmxControls/src/css/L.Control.gmxSidebar.css",
    "external/gmxControls/src/css/L.Control.gmxLogo.css",
    "external/gmxControls/src/css/external.css",

    "external/gmxDrawing/css/L.gmxDrawing.css"
];

if (typeof exports !== 'undefined') {
	exports.depsJS = depsJS;
	exports.depsCSS = depsCSS;
}

if (typeof gmxAPIv2DevOnLoad === 'function') {
	gmxAPIv2DevOnLoad(depsJS, depsCSS);
}
