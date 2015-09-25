define([
    "text!./templates/Option2.html",
    "views/charts/Sunburst",
    "transformers/AllIndicatorsSunburstTransformer",
    "models/App",
    "util/query",
    "util/HtmlUtil"
], function(template, Sunburst, AllIndicatorsSunburstTransformer, App, query, HtmlUtil){

    /**
     * Initializes Option 1 visualization based on provided dataset and element where it should be rendered
     * @param el
     * @param model
     * @constructor
     */
    function Option2(/*HTMLElement*/el, /*Dateset*/dataset){
        this.el = el;
        this.dataset = dataset;

        this.app = new App({ university : 1, indicatorValueType : 'RANK'});
    }

    /**
     * Renders view component to real dom tree
     */
    Option2.prototype.render = function(){
        var app = this.app,
            _this = this;

        this.el.innerHTML = template;

        this.universityNode = query.one("select.university", this.el);
        this.indicatorsNode = query.one(".indicators", this.el);
        this.indicatorValueTypeNode = query.one("select.value-type", this.el);

        HtmlUtil.populateDropdown(this.universityNode, this.dataset.getUniversities());

        this.universityNode.addEventListener('change', function(){
            app.set('university', _this.universityNode.value);
        }, false);

        this.indicatorValueTypeNode.addEventListener('change', function(){
            app.set('indicatorValueType', _this.indicatorValueTypeNode.value);
        }, false);

        this.renderCharts();
    }

    /**
     * Renders categories for the sunburst chart
     */
    Option2.prototype.renderCharts = function(){
        var _this = this;

        // TODO possible memory leak here
        var sunburst = new Sunburst(this.indicatorsNode, {
            barExtraCss : function(d){ return 'cat-' + d.catid; }
        });

        function drawIndicators(){
            sunburst.draw(AllIndicatorsSunburstTransformer(_this.dataset.getCategories(_this.app.university), 0.3, 0.04, _this.app.indicatorValueType));
        }

        this.app.observe('university', drawIndicators);
        this.app.observe('indicatorValueType', drawIndicators);

        drawIndicators();
    }

    return Option2;
});