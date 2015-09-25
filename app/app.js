require({
    baseUrl : './app',
    paths : {
        text : "../libs/text/text",
        domReady : "../libs/requirejs-domready/domReady",
        lodash : "../libs/lodash-amd/modern",
        d3 : "../libs/d3/d3"
    }
}, ['bootstrap', 'domReady!'], function (bootstrap) {
    bootstrap();
});

