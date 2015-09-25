// TODO: In case we will stay with options with barcharts - do small refactoring to draw method
define(["d3", 'lodash/collection/map'], function(d3, map){

    /**
     * Barchart compoenent. Takes HTMLElement where barchart should be rendered
     *
     * @param el
     * @constructor
     */
    function Barchart(el){
        this.el = el;

        this.opts = {
            width : 500,
            height: 200,

            barWidth : 30
        }
    }

    /**
     * Draws barchart with data from provided dataset
     *
     * @param dataset
     */
    Barchart.prototype.draw = function(dataset){
        var _this = this;
        var opts = this.opts;

        this.el.innerHTML = '';

        var values = map(dataset, function(d){ return d.value});
        var names = map(dataset, function(d){ return d.name});

        var width = d3.select(this.el).style('width');
        var topM = 20;
        var groupWidth = opts.width / values.length;
        var chartHeight = opts.height;

        var y = d3.scale.linear().domain([0, Math.max.apply(null, values)]).range([0, chartHeight]);
        var x = d3.scale.ordinal().domain(names).rangeBands([0, opts.width]);

        var xAxis = d3.svg.axis().scale(x).orient('bottom');

        var viz = d3.select(this.el).append('svg')
            .attr('height', opts.height + 60 + topM)
            .attr('width', opts.width)
            .attr('class', 'viz barchart');

        var bar = viz.selectAll('g').data(dataset)
            .enter().append('g')
            .attr('transform', function (d, i) { return 'translate(' + i * groupWidth+ ',0)'});

        bar.append('rect')
            .attr('width', opts.barWidth)
            .attr('height', function(d){ return y(d.value); })
            .attr('y', function(d){ return chartHeight - y(d.value) + topM; })
            .attr('x', (groupWidth - opts.barWidth) / 2)
            .attr('class', 'bar');


        bar.append("text")
            .attr("x", (groupWidth - opts.barWidth)/ 2)
            .attr("y", function(d) { return chartHeight - y(d.value) - 3 + topM; })
            .text(function(d) { return d.value; });

        viz.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (chartHeight + topM) + ')')
            .call(xAxis)
            .selectAll('text')
            .attr('dy', '30px')
    }

    return Barchart;
});