define([
    'text!./templates/Component.html',
    'models/Dataset',
    'models/App',
    'views/charts/Sunburst',
    'transformers/categoriesSunburst',
    'transformers/indicatorsSunburst',
    'util/query',
    'util/HtmlUtil',
    'd3'
], function (template, dataset, App, Sunburst, categoriesSunburst, indicatorsSunburst, query, HtmlUtil) {

    var MODE_INDICATORS = 'indicators',
        MODE_CATEGORIES = 'categories';

    // TODO: not very good place for definition.
    var ARC_DELTA = 0.2;

    /**
     * Function that initializes and renders full compoenent into provided element
     * @param el {HTMLElement}
     */
    return function (el) {
        // Defines application object that will be responsible for holding current state and
        // emitting change events
        var app = new App({university: 1, category: 1});

        /**
         * Options defined for categories sunburst
         */
        var themesOpts = {
            width: 600,
            height: 600,
            mouseOverRay: function (d) {
                app.set('category', d.id);
                app.set('mode', MODE_INDICATORS);
            },
            rayClass : function(d){
                return 'cat-' + d.id;
            }
        };

        /**
         * Options defined for indicators sunburst
         */
        var indicatorsOpts = {
            width: 600,
            height: 600,
            mouseOut: function (d) {
                app.set('mode', MODE_CATEGORIES);
            },
            rayClass : function(d){
                return 'cat-' + d.catid;
            }
        }


        el.innerHTML = template;

        var universityNode = query.one('.datassist-university', el);

        HtmlUtil.populateDropdown(universityNode, dataset.getUniversities());

        universityNode.addEventListener('change', function(){
            app.set('university', universityNode.value);
        }, false);

        // creates charts

        var themesChart = new Sunburst(query.one('.datassist-categories', el), themesOpts);

        var indicatorsChart = new Sunburst(query.one('.datassist-indicators', el), indicatorsOpts);

        function drawThemes(){
            themesChart.draw(categoriesSunburst(dataset, app.university, ARC_DELTA));
        }

        function drawIndicators(){
            indicatorsChart.draw(indicatorsSunburst(dataset, app.university, app.category, ARC_DELTA));
        }

        drawThemes();

        // binds modes: indicators / categories
        app.observe('mode', function () {
            if (app.mode == MODE_INDICATORS) {
                d3.select(themesChart.el).transition().delay(100).duration(700).style('opacity', 0);
                d3.select(indicatorsChart.el).style('display', 'block').transition().delay(100).duration(900).style('opacity', 1);
            }else{
                d3.select(themesChart.el).transition().delay(100).duration(900).style('opacity', 1);
                d3.select(indicatorsChart.el).transition().delay(100).duration(700).style('opacity', 0).each('end', function(){
                    d3.select(indicatorsChart.el).style('display', 'none');
                });
            }
        });

        app.observe('category', function(){
            drawIndicators();
        });
        app.observe('university', function(){
            drawThemes();
        });
    }
});