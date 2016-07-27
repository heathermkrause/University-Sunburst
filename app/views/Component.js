define([
    'text!./templates/Component.html',
    'models/Dataset',
    'text!data/university.json',
    'text!data/university_scores.json',
    'models/App',
    'views/charts/Sunburst',
    'views/Dropdown',
    'transformers/categoriesSunburst',
    'transformers/indicatorsSunburst',
    'util/query',
    'util/HtmlUtil',
    'd3'
], function (template, Dataset, dataRating, dataScores, App, Sunburst, dropdown, categoriesSunburst, indicatorsSunburst, query, HtmlUtil, d3) {
    var MODE_INDICATORS = 'indicators',
        MODE_CATEGORIES = 'categories';

    // TODO: not very good place for definition.
    var CATEGORY_ARC_DELTA = 0.1,
        INDICATOR_ARC_DELTA = 0.08;

    // Fill colors mapped to category ID
    var FILL_COLORS = {
        1: '#324d5c',
        2: '#46B29D',
        3: '#F0CA4D',
        4: '#E37B40',
        5: '#300A57'
    };

    /**
     * Function that initializes and renders full compoenent into provided element
     * @param el {HTMLElement}
     */
    return function (el) {
        // Defines application object that will be responsible for holding current state and
        // emitting change events
        var app = new App({university: 1, lang: 'en'});

        var ratingDataset = new Dataset(dataRating),
            scoreDataset = new Dataset(dataScores);

        app.set('data', ratingDataset);

        var CATEGORY_OVER_DELAY = 400;
        var categoryOverTimer = null;

        /**
         * Options defined for categories sunburst
         */
        var themesOpts = {
            maxValue: 20,

            mouseOverRay: function (d) {
                categoryOverTimer = setTimeout(function(){
                    app.setCategory(d.id, d.startAngle, d.endAngle);
                }, CATEGORY_OVER_DELAY);
            },

            mouseOutRay : function(){
              if(categoryOverTimer){
                  clearTimeout(categoryOverTimer);
                  categoryOverTimer = null;
              }
            },

            tooltipText: function (d) {
                return (d.longname || d.name);
            },

            rayClass: function (d) {
                return 'cat-' + d.id;
            },

            fillColor: function (d) {
                return FILL_COLORS[d.id];
            }
        };

        /**
         * Options defined for indicators sunburst
         */
        var indicatorsOpts = {
            mouseOut: function (d) {
                app.set('mode', MODE_CATEGORIES);
            },

            tooltipText: function (d) {
                return (d.longname || d.name );
            },

            rayClass: function (d) {
                return 'cat-' + d.catid;
            },

            fillColor: function (d, index) {
                return d3.rgb(FILL_COLORS[d.catid]).darker(index);
            },

            strokeColor: function (d, index) {
                return d3.rgb(FILL_COLORS[d.catid]).darker(index + 1);
            }
        };

        // Defines scale and scale domains for rating and score cases
        var ratingScaleDomain = [0, 20],
            scoreScaleDomain = [-3, 3],
            scoreScale = [-3, -1.5, 0, 1.5, 3];

        el.innerHTML = template;

        var universityNode = query.one('.datassist-university', el);

        var universitydd = dropdown(universityNode);

        HtmlUtil.populateDropdown(universityNode, app.data.getUniversities());

        universitydd.setValue(app.university);

        universityNode.addEventListener('change', function () {
            app.set('university', universityNode.value);
        }, false);

        // Initializes languages behaviour
        var langNodes = query(".lang a");

        /**
         * Handler for switching language
         */
        function onSwitchLangClick(evt) {
            evt.preventDefault();
            app.set('lang', evt.target.getAttribute('data-lang'));
        }

        function updateLang() {
            Array.prototype.forEach.call(langNodes, function (node) {
                node.className = node.getAttribute('data-lang') == app.lang ? 'active' : ''
            });
        }

        Array.prototype.forEach.call(langNodes, function (node) {
            node.addEventListener('click', onSwitchLangClick);
        }, false);

        updateLang();

        // creates charts

        var themesChart = new Sunburst(query.one('.datassist-categories', el), themesOpts);
        var indicatorsChart = new Sunburst(query.one('.datassist-indicators', el), indicatorsOpts);

        function drawThemes() {
            var categoriesDataset = categoriesSunburst(app.data, app.university, CATEGORY_ARC_DELTA, app.lang);

            themesChart.drawData(categoriesDataset);

            if(!app.category){
                var category = categoriesDataset[0];
                app.setCategory(category.id, category.startAngle, category.endAngle);
            }else{
                drawIndicators();
            }
        }

        function drawIndicators() {
            indicatorsChart.drawData(indicatorsSunburst(app.data, app.university, app.category, INDICATOR_ARC_DELTA, app.indStartAngle, app.indEndAngle, app.lang));
        }

        function renderCharts(){
            themesChart.render();
            themesChart.drawScale();

            indicatorsChart.render();
            indicatorsChart.drawScale();
        }

        function setScoreData(){
            themesChart.setOption('scale', scoreScale);
            themesChart.setOption('scaleDomain', scoreScaleDomain);
            themesChart.setOption('minOuterRadius', 0);

            indicatorsChart.setOption('scale', scoreScale);
            indicatorsChart.setOption('scaleDomain', scoreScaleDomain);
            indicatorsChart.setOption('minOuterRadius', 0);

            app.set('data', scoreDataset);

            renderCharts();
            drawThemes();
        }

        function setRatingData(){
            themesChart.setOption('scale', 'auto');
            themesChart.setOption('scaleDomain', ratingScaleDomain);
            themesChart.setOption('minOuterRadius', 40);

            indicatorsChart.setOption('scale', 'auto');
            indicatorsChart.setOption('scaleDomain', ratingScaleDomain);
            indicatorsChart.setOption('minOuterRadius', 40);

            app.set('data', ratingDataset);

            renderCharts();
            drawThemes();
        }

        app.observe('category', function (p, value, oldValue) {
            if(oldValue != value){
                drawIndicators();
            }
        });

        app.observe('university', function () {
            drawThemes();
        });

        app.observe('lang', function () {
            updateLang();
            drawThemes();
        });

        //query.one('.units a').addEventListener('click', function(evt){
        //    evt.preventDefault();
        //    var target = evt.target;
        //
        //    var newText = target.getAttribute('data-other');
        //    var text = target.innerHTML;
        //
        //    target.innerHTML = newText;
        //    target.setAttribute('data-other', text);
        //
        //    if(text == 'Scores'){
        //        setScoreData();
        //    }else{
        //        setRatingData();
        //    }
        //});


        setScoreData();
    }
});