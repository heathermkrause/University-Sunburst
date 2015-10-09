define(["d3", 'util/HtmlUtil', 'views/Tooltip'], function (d3, HtmlUtil, Tooltip) {

    /**
     * Toggles selection to the arc specified by arcNode
     *
     * @param   arcNode     HTMLElement that should be selected.
     */
    function selectArc(arcNode) {
        d3.select(arcNode.parentNode).selectAll('.arc').classed('selected', false);
        d3.select(arcNode).classed('selected', true);
    }

    /**
     * Creates d3 arc generator
     * @param       scaleSize
     */
    function arc(scaleSize) {
        return d3.svg.arc()
            .innerRadius(0)
            .outerRadius(function (d) { return scaleSize(d.size)})
            .startAngle(function (d) { return d.startAngle; })
            .endAngle(function (d) { return d.startAngle + d.deltaAngle; });
    }

    /**
     * Returns CSS class for particular ray
     *
     * @param d
     * @return {string}
     */
    function rayClass(d) {
        return typeof d.id != 'undefined' ? 'id-' + d.id : '';
    }

    /**
     * Returns fill color that should be used for particular ray
     */
    function fillColor(d) {
        return '#0088cc';
    }

    /**
     * Returns stroke color for particular ray
     */
    function strokeColor(d){
        return '#444';
    }

    /**
     * Shows tooltip at the specified coordinates. For text value uses either default template or custom function provided in options
     *
     * @param d
     * @param ox
     * @param oy
     * @param tooltip
     */
    function showTooltip(d, ox, oy, tooltip, opts) {
        var xy = d3.mouse(this);

        tooltip.show(opts.tooltipText(d), xy[1] + oy + 5 + 'px', xy[0] + ox + 5 + 'px');
    }

    /**
     * Default function that returns tooltip text for each 'd'
     */
    function tooltipText(d) {
        return d.name + ': ' + d.size;
    }

    /**
     * Wraps provided callback to be called with extra arguments
     * @param callback
     */
    function wrapWith(/*callback, ..opts?*/) {
        var args = Array.prototype.slice.call(arguments, 0),
            callback = args.shift();

        return function (d) {
            return callback.apply(this, [d].concat(args));
        }
    }

    /**
     * Default sunburst constructor. Takes HTMLElement in document where sunburst should be generated
     * and options opts map that will to override default options if needed
     *
     * @param el
     * @param opts
     * @constructor
     */
    function Sunburt(el, opts) {
        this.el = el;

        this.opts = {
            width: 599,
            height: 500,
            chartOffset: 60,
            // minimum size of the bar in chart
            minOuterRadius: 40,
            // offset for legend text. decreases maximum radius to radius where labels are located
            labelOffset: 40,

            // maximum possible value of the data. If not defined - maxValue is taken as maximum among existing data
            // otherwise uses privided value
            // this allows to create scaleSize independently from given data
            maxValue: null,

            // Count of the levels on background scale
            scaleLevels: 4,

            tooltipText: tooltipText,

            rayClass: rayClass,

            fillColor: fillColor,
            strokeColor : strokeColor,

            useGradient: false,

            mouseOut: function () { /* empty implementation */},
            mouseOverRay: function () { /* empty implementation */ }
        }

        // overrides default properties with provided (if any)
        if (opts) {
            for (p in opts) {
                if (opts.hasOwnProperty(p)) {
                    this.opts[p] = opts[p]
                }
            }
        }
    }

    /**
     * Draws provided dataset
     * TODO deal more correct with legendLabelOffset - currently it is offset from outer radius that looks confusing
     * @param dataset
     */
    Sunburt.prototype.draw = function (dataset) {
        this.el.innerHTML = '';

        var _this = this,
            opts = this.opts;

        var width = opts.width - opts.chartOffset * 2,
            height = opts.height - opts.chartOffset * 2;

        var radius = Math.min(width, height) / 2, // chart radius
            R = radius + opts.chartOffset - opts.labelOffset; // outer radius for legend

        // creates bar sizes scale from sizes range to radius value in pixels
        var sizes = dataset.map(function (d) { return d.size;}),
            maxSize = opts.maxValue || Math.max.apply(Math, sizes),
            minSize = Math.min.apply(Math, sizes);
        //    scaleSize = d3.scale.linear().domain([minSize, maxSize]).range([opts.minOuterRadius, radius]);

        var scaleSize = d3.scale.linear().domain([0, maxSize]).range([opts.minOuterRadius, radius]);

        var range = d3.range(maxSize, 0, -opts.scaleLevels).reverse();

        var outer = this.el.appendChild(document.createElement('div'));

        var tooltip = new Tooltip(outer);

        // prepares svg
        var svg = d3.select(outer).append('svg')
            .attr('class', 'datassist-sunburst')
            .attr('width', opts.width)
            .attr('height', opts.height);


        /// GRADIENTS {{{
        if (opts.useGradient) {
            var grad = svg.selectAll('radialGradient').data(dataset).enter().append("radialGradient")
                .attr("id", function (d, index) { return 'gradient_' + index; })

            grad.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', function (d) { return opts.fillColor(d);})

            grad.append('stop')
                .attr('offset', '20%')
                .attr('stop-color', function(d){ return d3.rgb(opts.fillColor(d)).brighter(1);})

            grad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', function (d) { return d3.rgb(opts.fillColor(d)).darker(1);});
        }

        //svg.append("linearGradient")
        //    .attr("id", "grad1")
        //    .selectAll("stop")
        //    .data([
        //        {offset: "0%", color: "red"},
        //        {offset: "100%", color: "lawngreen"}
        //    ])
        //    .enter().append("stop")
        //    .attr("offset", function (d) { return d.offset; })
        //    .attr("stop-color", function (d) { return d.color; });


        /// GRADIENTS }}}

        var oX = opts.width / 2,
            oY = opts.height / 2;

        var g = svg.append('g').attr('transform', 'translate(' + opts.width / 2 + ', ' + opts.height / 2 + ')')
            .on('mouseleave', opts.mouseOut);


        var vizScale = g.append('g');

        vizScale.append('circle')
            .attr('r', radius)
            .attr('fill', '#f2f2f2')
        ;

        vizScale.selectAll('circle.scale').data(range)
            .enter().append('circle')
            .attr('r', function (d) { return scaleSize(d); })
            .attr('stroke', '#cecece')
            .attr('fill', 'none')
        ;

        vizScale.selectAll('text').data(range).enter().append('text')
            .text(function (d) { return Math.round(d)})
            .attr('y', function (d) { return scaleSize(d)});

        var viz = g
            .append('g')
            .attr('class', 'chart')
            .selectAll('path').data(dataset).enter();

        var bar = viz
            .append('path')
            .attr('d', arc(scaleSize))
            .attr('class', opts.rayClass)
            .attr('data-id', function (d) { return d.id; }) // optional
            .attr('fill', opts.useGradient ? function(d, index){ return 'url(#gradient_' + index + ')' } : opts.fillColor)
            .attr('stroke', opts.strokeColor)
            .classed('arc', true)
            .on('mouseover', opts.mouseOverRay)
            .on('mousemove', wrapWith(showTooltip, oX, oY, tooltip, opts))
            .on('mouseout', function () { tooltip.hide(); });

        /// TODO: Updates lines and text positioning to make it more readable and prevent copy pasting, and extract constants to options
        viz.append('line')
            .attr('x1', function (d) { return (scaleSize(d.size) + 5) * Math.sin(d.startAngle + d.deltaAngle / 2); })
            .attr('y1', function (d) { return -(scaleSize(d.size) + 5) * Math.cos(d.startAngle + d.deltaAngle / 2); })
            .attr('x2', function (d) { return Math.min(R, (scaleSize(d.size) + 20)) * Math.sin(d.startAngle + d.deltaAngle / 2); })
            .attr('y2', function (d) { return -Math.min(R, (scaleSize(d.size) + 20)) * Math.cos(d.startAngle + d.deltaAngle / 2); });


        var textDelta = 5;

        function textX(d) {
            var angle = d.startAngle + d.deltaAngle / 2;

//            return Math.max((R + textDelta), scaleSize(d.size) + 20 + textDelta) * Math.sin(angle) - (angle > Math.PI ? HtmlUtil.measure(text(d), 'sunburst-text-measure', this.el) : 0);
            return Math.min((R + textDelta), scaleSize(d.size) + 20 + textDelta) * Math.sin(angle);
        }

        function textY(d) {
            var angle = d.startAngle + d.deltaAngle / 2;

            var y = -(Math.min(R + textDelta, scaleSize(d.size) + 20 + textDelta)) * Math.cos(angle);
            if (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) {
                y += 10;
            }

            return y;
        }

        function text(d) {
            return d.name + ' (' + d.size + ')';
        }

        viz.append('text')
            .attr('x', textX)
            .attr('y', textY)
            .attr('text-anchor', function (d) { return d.startAngle + d.deltaAngle / 2 > Math.PI ? 'end' : null})
            .text(text);
    }

    /**
     * Selects arc by its ID
     * @param id
     */
    Sunburt.prototype.select = function (id) {
        selectArc(d3.select(this.el).select('.arc[data-id="' + id + '"]').node());
    }

    return Sunburt;
});