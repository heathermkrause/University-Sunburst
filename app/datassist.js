require({
    baseUrl : './app',
    urlArgs: 'bust=' + Date.now(),
    paths : {
        text : "../node_modules/requirejs-text/text",
        d3 : "../node_modules/d3/build/d3"
    }
}, ['bootstrap', 'd3'], function (bootstrap, d3) {
    var ready = function(){
        bootstrap(document.getElementById('embed'));
    };

    document.addEventListener('DOMContentLoaded', ready, false);

    if(document.readyState === "complete"){
        ready();
    }
});