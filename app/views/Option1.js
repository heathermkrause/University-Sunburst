define([
    "text!./templates/Option1.html",
    "views/charts/Sunburst",
    "views/charts/Barchart",
    "transformers/CategoriesTransformer",
    "transformers/IndicatorsBarchartTransformer",
    "models/App",
    "util/query",
    "util/HtmlUtil"
], function(template, Sunburst, Barchart, CategoriesTransformer, IndicatorsBarchartTransformer, App, query, HtmlUtil){
    /**
     * Initializes Option 1 visualization based on provided dataset and element where it should be rendered
     * @param el
     * @param model
     * @constructor
     */
    function Option1(/*HTMLElement*/el, /*Dateset*/dataset){
        this.el = el;
        this.dataset = dataset;

        this.app = new App({ university : 1, category : 1});
    }

    /**
     * Renders view component to real dom tree
     */
    Option1.prototype.render = function(){
        var app = this.app,
            _this = this;

        this.el.innerHTML = template;

        this.universityNode = query.one("select.university", this.el);
        this.categoriesNode = query.one(".categories", this.el);
        this.indicatorsNode = query.one(".indicators", this.el);

        HtmlUtil.populateDropdown(this.universityNode, this.dataset.getUniversities());

        this.universityNode.addEventListener('change', function(){
            app.set('university', _this.universityNode.value);
        }, false);

        this.renderCharts();
    }

    /**
     * Renders categories for the sunburst chart
     */
    Option1.prototype.renderCharts = function(){
        var _this = this;

        // TODO possible memory leak here
        var sunburst = new Sunburst(this.categoriesNode, {
            chartOffset : 100,
            legedLabelOffset : 150,
            barExtraCss : function(d){ return 'cat-' + d.id; },
            selectable : true
        });
        var barchart = new Barchart(this.indicatorsNode);

        function drawIndicators(){
            barchart.draw(IndicatorsBarchartTransformer(_this.dataset.getIndicators(_this.app.university, _this.app.category), 'RANK'));
        }

        function drawAll(){
            sunburst.draw(CategoriesTransformer(_this.dataset.getCategories(_this.app.university), 0.4));
            sunburst.select(_this.app.category);
            drawIndicators();
        }

        this.categoriesNode.addEventListener('select', function(evt){
            _this.app.set('category', evt.detail.value);
        }, false);

        this.app.observe('university', drawAll);
        this.app.observe('category', drawIndicators);

        drawAll();
    }

    return Option1;
})
