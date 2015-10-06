require({
    baseUrl : './app',
    urlArgs: 'bust=' + Date.now(),
    paths : {
        text : "../libs/text/text",
        domReady : "../libs/requirejs-domready/domReady",
        d3 : "../libs/d3/d3"
    }
}, ['bootstrap', 'domReady!'], function (bootstrap) {

    bootstrap(document.getElementById('col1'));
    bootstrap(document.getElementById('col2'));
});
