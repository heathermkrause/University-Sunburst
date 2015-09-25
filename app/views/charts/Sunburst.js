define(["d3", "util/HtmlUtil", 'lodash/object/extend', 'lodash/collection/map'], function(d3, HtmlUtil, extend, map){

    /**
     * Toggles selection to the arc specified by arcNode
     *
     * @param   arcNode     HTMLElement that should be selected.
     */
    function selectArc(arcNode){
        d3.select(arcNode.parentNode).selectAll('.arc').classed('selected', false);
        d3.select(arcNode).classed('selected', true);
    }

    /**
     * Creates d3 arc generator
     * @param       scaleSize
     */
    function arc(scaleSize){
        return d3.svg.arc()
            .innerRadius(0)
            .outerRadius(function(d){ return scaleSize(d.size)})
            .startAngle(function(d){ return d.startAngle; })
            .endAngle(function(d) { return d.startAngle + d.deltaAngle; });
    }

    /**
     * Default sunburst constructor. Takes HTMLElement in document where sunburst should be generated
     * and options opts map that will to override default options if needed
     *
     * @param el
     * @param opts
     * @constructor
     */
    function Sunburt(el, opts){
        this.el = el;

        this.opts = {
            width : 599,
            height: 500,
            chartOffset : 60,
            // minimum size of the bar in chart
            minOuterRadius : 40,
            // offset for legend text. decreases maximum radius to radius where labels are located
            legedLabelOffset : 40,

            barExtraCss : null
        }

        if(opts){
            this.opts = extend(this.opts, opts);
        }
    }

    /**
     * Draws provided dataset
     * TODO deal more correct with legendLabelOffset - currently it is offset from outer radius that looks confusing
     * @param dataset
     */
    Sunburt.prototype.draw = function(dataset){
        this.el.innerHTML = '';

        var _this = this,
            opts = this.opts;

        var width = opts.width - opts.chartOffset * 2,
            height = opts.height - opts.chartOffset * 2;

        var radius = Math.min(width, height) / 2, // chart radius
            R = radius + opts.chartOffset - opts.legedLabelOffset; // outer radius for legend

        // creates bar sizes scale from sizes range to radius value in pixels
        var sizes = map(dataset, function(d){ return d.size;}),
            maxSize = Math.max.apply(Math, sizes),
            minSize = Math.min.apply(Math, sizes),
            scaleSize = d3.scale.linear().domain([minSize, maxSize]).range([opts.minOuterRadius, radius]);

        // prepares svg
        var svg = d3.select(this.el).append('svg')
            .attr('class', 'viz sunburst')
            .attr('width', opts.width)
            .attr('height', opts.height);

        var viz = svg
            .append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + opts.width / 2 + ', ' + opts.height / 2 + ')')
            .selectAll('path').data(dataset).enter();

        var bar = viz
            .append('path')
            .attr('d', arc(scaleSize))
            .attr('class', opts.barExtraCss)
            .attr('data-id', function(d){ return d.id; }) // optional
            .classed('arc', true)

        if(opts.selectable) {
            bar.on('click', function (d) {
                selectArc(this);

                this.dispatchEvent(new CustomEvent('select', {
                    detail: {value: this.getAttribute('data-id')},
                    bubbles: true
                }));
            });
        }

        /// TODO: Updates lines and text positioning to make it more readable and prevent copy pasting, and extract constants to options
        viz.append('line')
            .attr('x1', function(d){ return (scaleSize(d.size) + 5) * Math.sin(d.startAngle + d.deltaAngle / 2); })
            .attr('y1', function(d){ return -(scaleSize(d.size) + 5) * Math.cos(d.startAngle + d.deltaAngle / 2); })
            .attr('x2', function(d){ return Math.max(R, (scaleSize(d.size) + 20)) * Math.sin(d.startAngle + d.deltaAngle / 2); })
            .attr('y2', function(d){ return -Math.max(R, (scaleSize(d.size) + 20)) * Math.cos(d.startAngle + d.deltaAngle / 2); });


        var textDelta = 5;
        function textX(d){
            var angle = d.startAngle + d.deltaAngle / 2;

            return Math.max((R + textDelta), scaleSize(d.size) + 20 + textDelta) * Math.sin(angle) - (angle > Math.PI ? HtmlUtil.measure(text(d), 'sunburst-text-measure') : 0);
        }

        function textY(d){
            var angle = d.startAngle + d.deltaAngle / 2;

            var y = -(Math.max(R + textDelta, scaleSize(d.size) + 20 + textDelta)) * Math.cos(angle);
            if(angle > Math.PI / 2 && angle < 3 * Math.PI / 2){
                y += 10;
            }

            return y;
        }

        function text(d){
            return d.name + ' (' + d.size + ')';
        }

        viz.append('text')
            .attr('x', textX)
            .attr('y', textY)
            .text(text)
    }

    /**
     * Selects arc by its ID
     * @param id
     */
    Sunburt.prototype.select = function(id){
        selectArc(d3.select(this.el).select('.arc[data-id="' + id + '"]').node());
    }

    return Sunburt;
});