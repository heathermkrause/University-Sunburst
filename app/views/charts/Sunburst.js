define(["d3", 'util/HtmlUtil', 'views/Tooltip'], function(d3, HtmlUtil, Tooltip){

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
            .endAngle(function(d){ return d.startAngle + d.deltaAngle; });
    }

    /**
     * Returns CSS class for particular ray
     *
     * @param d
     * @return {string}
     */
    function rayClass(d){
        return typeof d.id != 'undefined' ? 'id-' + d.id : '';
    }

    /**
     * Returns fill color that should be used for particular ray
     */
    function fillColor(d){
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
    function showTooltip(d, ox, oy, tooltip, opts){
        var xy = d3.mouse(this),
            x = xy[0];

        tooltip.show(opts.tooltipText(d), xy[1] + oy + 5 + 'px', x + ox + (x < 0 ? 5 : -tooltip.offsetWidth() - 5) + 'px');
    }

    /**
     * Default function that returns tooltip text for each 'd'
     */
    function tooltipText(d){
        return d.name + ': ' + d.size;
    }

    /**
     * Wraps provided callback to be called with extra arguments
     * @param callback
     */
    function wrapWith(/*callback, ..opts?*/){
        var args = Array.prototype.slice.call(arguments, 0),
            callback = args.shift();

        return function(d){
            return callback.apply(this, [d].concat(args));
        }
    }

    /**
     * Class responsible for finding labels position so that is does not intersect each other
     * @param {D3Selection} labelGroup - Group where labels will be located. This is used for dimension calculations of the particular label using testSpan
     * @constructor
     */
    function LabelPosition(labelGroup, maxX, maxY){
        var SPAN_ID = '__datassist_testspan';
        var occupied = {};

        var testNode = document.getElementById(SPAN_ID),
            testSpan = testNode ? d3.select(testNode) : labelGroup.append('text').style('visibility', 'hidden').attr('id', SPAN_ID);

        /**
         * Returns label position for 'd' data, so that it does not intersect other labels
         * Starts from minimum radius and checks if it is intersect already occupied positions. If so - increases radius
         *
         * @return {*}
         */
        this.find = function(text, angle, startRadius){
            if(occupied[angle]) {
                return occupied[angle];
            }

            testSpan.text(text);

            var bbox = testSpan.node().getBBox(),
                w = bbox.width,
                h = bbox.height;

            var r = startRadius,
                angle = angle;

            /**
             * Checks if rectangles are intersecting
             */
            var isIntersect = function(rec0, rec1){
                var m = 3;
                return !(rec0.x1 + m < rec1.x0 || rec0.x0 - m > rec1.x1 || rec0.y0 - m > rec1.y1 || rec0.y1 + m < rec1.y0);
            }

            var intersect = false,
                rec0 = null;

            var limit = 300;

            var delta = 3,
                pad = 2;

            var minRadius = 20;

            var deltaY = 0;

            var PI = Math.PI, PI2 = Math.PI / 2;

            // returns if given rec is out of mix / max ranges
            var checkIsOut = function(rec){
                return rec.x1 > maxX || rec.x0 < -maxX || rec.y0 < -maxY || rec.y1 > maxY;
            }

            do {
                if(!limit) {
                    break;
                }

                var x = r * Math.sin(angle),
                    y = -r * Math.cos(angle) + deltaY;

                if(angle > 0 && angle <= PI2)
                // 1st quater
                {
                    rec0 = {x0: x, y0: y - h}

                } else if(angle > PI2 && angle <= PI)
                // 2nd quater
                {
                    rec0 = {x0: x, y0: y, linex: x, liney: y}

                } else if(angle > PI && angle <= 3 * PI2)
                // 3st quater
                {
                    rec0 = {x0: x - w - pad, y0: y}

                } else
                // 4th quoter
                {
                    rec0 = {x0: x - w - pad, y0: y - h}
                }

                rec0.w = w + pad;
                rec0.h = h + pad;
                rec0.x1 = rec0.x0 + rec0.w;
                rec0.y1 = rec0.y0 + rec0.h;
                rec0.dx = 3;
                rec0.dy = h;
                rec0.lineX = r < startRadius ? startRadius * Math.sin(angle) : x;
                rec0.lineY = r < startRadius ? -startRadius * Math.cos(angle) : y;

                var isOut = false;
                if(checkIsOut(rec0)) {
                    // if label is out by x coordinate, tries to set x0 to the center of the label
                    var ox0 = rec0.x0,
                        ox1 = rec0.x1,
                        w2 = rec0.w / 2;

                    if(angle < PI) {
                        rec0.x0 -= w2;
                        rec0.x1 -= w2;
                    } else {
                        rec0.x0 += w2;
                        rec0.x1 += w2;
                    }

                    if(checkIsOut(rec0)) {
                        isOut = true;
                        rec0.x0 = ox0;
                        rec0.x1 = ox1;
                    }
                }

                if(isOut && delta > 0) {
                    delta = -delta;
                    r = startRadius + delta;
                }

                if(isOut) {
                    r += delta;
                    intersect = true;
                    limit--;
                    continue;
                }

                var intersect = false;
                for(p in occupied) {
                    var rec1 = occupied[p];
                    if(isIntersect(rec0, rec1)) {
                        intersect = true;
                        r += delta;

                        // if we already checked increasing radius and decreasing to very min,
                        // lets start from beginning and try to add deltaY offset - Positive in first half
                        // and negative in second half
                        if(r < minRadius) {
                            r = startRadius;
                            deltaY += angle > PI ? -5 : 5;
                        }

                        break;
                    }
                }

                limit--;

            } while(intersect);
            occupied[angle] = rec0;

            return rec0;
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
    function Sunburst(el, opts){
        this.el = el;

        this.opts = {
            width: 0, // if not defined, take width from DOM node, where chart is embedded
            height: 0, // if not defined, take height from DOM node, where chart is embedded

            padding: [20, 50, 20, 50],

            // minimum size of the ray in chart
            minOuterRadius: 0,

            // offset for legend text. decreases maximum radius to radius where labels are located
            labelOffset: 40,

            // maximum possible value of the data. If not defined - maxValue is taken as maximum among existing data
            // otherwise uses privided value
            // this allows to create scaleSize independently from given data
            maxValue: null,

            // Count of the levels on background scale
            scaleLevels: 4,

            scale: 'auto', // auto or array of values
            scaleDomain: [0, 10], // domain values

            tooltipText: tooltipText,

            rayClass: rayClass,

            fillColor: fillColor,
            strokeColor: strokeColor,

            useGradient: false,

            mouseOut: function(){ /* empty implementation */},
            mouseOverRay: function(){ /* empty implementation */ },
            mouseOutRay: function(){ /* empty implementation */ },
            clickRay: function(){ /* empty implementation */ }
        };

        // overrides default properties with provided (if any)
        if(opts) {
            for(p in opts) {
                if(opts.hasOwnProperty(p)) {
                    this.opts[p] = opts[p]
                }
            }
        }

        if(!this.opts.width) {
            this.opts.width = el.offsetWidth;
        }

        if(!this.opts.height) {
            this.opts.height = el.offsetHeight;
        }

        var padding = this.opts.padding;
        if(!Array.isArray(padding)) {
            this.opts.padding = padding = [padding, padding, padding, padding];
        }

        this.preCalculate();
        this.render();
        this.drawScale();


        /// private declaration
    }

    /**
     * Calculates and stores values related to chart dimensions
     */
    Sunburst.prototype.preCalculate = function(){
        // do some precalculations
        var opts = this.opts,
            width = opts.width,
            height = opts.height,
            padding = opts.padding;

        this.chartRadius = Math.min(width - padding[1] - padding[3], height - padding[0] - padding[2]) / 2;

        // coordinates of the center
        this.oX = width / 2;
        this.oY = height / 2;
    }

    /**
     * Renders base sunburst elements, without drawing dataset
     */
    Sunburst.prototype.render = function(){
        this.el.innerHTML = '';

        var _this = this,
            opts = this.opts;

        var outer = this.el.appendChild(document.createElement('div'));

        // prepares scale
        this.scaleSize = d3.scale.linear().domain(opts.scaleDomain).range([opts.minOuterRadius, this.chartRadius]);

        // prepares svg
        var svg = d3.select(outer).append('svg')
            .attr('class', 'datassist-sunburst')
            .attr('width', opts.width)
            .attr('height', opts.height);

        // creates main group that represents coordinates center
        this.mainGroup = svg.append('g').attr('transform', 'translate(' + opts.width / 2 + ', ' + opts.height / 2 + ')')
            .on('mouseleave', opts.mouseOut);

        // create groups that will be used for rendering real data
        this.scaleGroup = this.mainGroup.append('g').attr('class', 'scale-group');
        this.chartGroup = this.mainGroup.append('g').attr('class', 'chart-group');
        this.labelGroup = this.mainGroup.append('g').attr('class', 'label-group');

        this.tooltip = new Tooltip(outer);
    };

    /**
     * Renders scale of the sunburst. It is supposed that we uses maxValue in options, so that we dont need dataset
     * to define maximum value on scale
     */
    Sunburst.prototype.drawScale = function(){
        var opts = this.opts,
            _this = this;

        var data = opts.scale == 'auto' ? d3.range(opts.scaleDomain[1], opts.scaleDomain[0], -opts.scaleLevels).reverse() : opts.scale;

        this.scaleGroup.selectAll('*').remove();

        var vizScale = this.scaleGroup.append('g');

        vizScale.append('circle')
            .attr('r', this.chartRadius)
            .attr('fill', '#f2f2f2')
        ;

        vizScale.selectAll('circle.scale').data(data)
            .enter().append('circle')
            .attr('r', function(d){ return _this.scaleSize(d); })
            .attr('stroke', function(d){ return d == 0 ? 'rgba(0, 0, 0, 0.4)' : '#cecece';})
            .attr('fill', 'none')
        ;

        vizScale.selectAll('text.scale').data(data).enter().append('text')
            .attr('class', 'scale')
            .text(function(d){ return d})
            .attr('y', function(d){ return _this.scaleSize(d)});
    }

    /**
     * Draws provided dataset
     * TODO deal more correct with legendLabelOffset - currently it is offset from outer radius that looks confusing
     * @param dataset
     */
    Sunburst.prototype.drawData = function(dataset){
        //return;
        var _this = this,
            opts = this.opts;

        // create groups that will be used for rendering real data
        this.chartGroup.selectAll('*').remove();

        var maxScaleSize = opts.scaleDomain[1];
        dataset.forEach(function(d){ d.size = Math.min(d.size, maxScaleSize)});;

        this.chartGroup.selectAll('path').data(dataset).enter()
            .append('path')
            .attr('d', arc(this.scaleSize))
            .attr('class', function(d){ return opts.rayClass(d) + (d.value == "" ? " hidden" : ""); })
            .attr('data-id', function(d){ return d.id; }) // optional
            .attr('fill', opts.fillColor)
            .attr('stroke', opts.strokeColor)
            .style('display', function(d){ return isNaN(parseInt(d.size)) ? 'none' : 'block'})
            .classed('arc', true)
            .on('mouseenter', opts.mouseOverRay)
            .on('click', opts.clickRay)
            .on('mousemove', wrapWith(showTooltip, this.oX, this.oY, this.tooltip, opts))
            .on('mouseleave', function(){
                setTimeout(function(){ _this.tooltip.hide()}, 0);
                opts.mouseOutRay.apply(this, arguments)
            });

        // Creates chart labels
        var labelPosition = new LabelPosition(this.chartGroup, opts.width / 2, opts.height / 2);

        var labelLayout = (function(){
            // returns position from d
            var dPos = function(d){
                return labelPosition.find(text(d), d.startAngle + d.deltaAngle / 2, _this.scaleSize(d.size) + 3);
            };

            return {
                x: function(d){ return dPos(d).x0; },
                y: function(d){ return dPos(d).y0; },

                ly: function(d){ return dPos(d).y0 + dPos(d).dy; },
                lx: function(d){ return dPos(d).x0 + dPos(d).dx; },

                lineX: function(d){ return dPos(d).lineX; },
                lineY: function(d){ return dPos(d).lineY; },

                h: function(d){ return dPos(d).h; },
                w: function(d){ return dPos(d).w; }
            }
        })();

        function text(d){
            return d.name;
        }

        this.labelGroup.selectAll('*').remove();

        var g = this.labelGroup.selectAll('text').data(dataset).enter();

        g.append('rect')
            .attr('x', labelLayout.x)
            .attr('y', labelLayout.y)
            .attr('width', labelLayout.w)
            .attr('height', labelLayout.h)
            .on('mouseenter', function(d){
                var ray = _this.chartGroup.select('path[data-id="' + d.id + '"]');
                selectArc(ray.node());
            })
            .on('mouseleave', function(){
                _this.chartGroup.selectAll('.arc').classed('selected', false);
            })
        ;

        // TODO: add labels inside rectangles. may be it makes sense with possible wrapping
        g.append('text')
            .attr('class', function(d){ return 'label' + (d.value == "" ? " hidden" : ""); })
            .attr('x', labelLayout.lx)
            .attr('y', labelLayout.ly)
            .style('display', function(d){ return isNaN(parseInt(d.size)) ? 'none' : 'block'})
            .text(text)
            .on('mouseenter', function(d){
                var ray = _this.chartGroup.select('path[data-id="' + d.id + '"]');
                selectArc(ray.node());
            })
            .on('mouseleave', function(){
            _this.chartGroup.selectAll('.arc').classed('selected', false);
        });


        g.append('line')
            .attr('class', function(d){ return d.value == "" ? " hidden" : ""; })
            .attr('x1', function(d){ return (_this.scaleSize(d.size) + 2) * Math.sin(d.startAngle + d.deltaAngle / 2); })
            .attr('y1', function(d){ return -(_this.scaleSize(d.size) + 2) * Math.cos(d.startAngle + d.deltaAngle / 2); })
            .attr('x2', labelLayout.lineX)
            .attr('y2', labelLayout.lineY);

        /**
         * Wraps words in text into separated tspan.
         * Currently it is not used because of:
         * 1. New algorithm for finding labels positions
         * 2. Together with word wrapping and background for labels it would be a bit hard to: recalculate rect, recalculate
         *      all labels position, as wraping is dont after label is on the screen
         * @deprecated
         */
        function wrap(d){
            var sel = d3.select(this),
                tokens = sel.text().split("\n");

            if(tokens.length > 1) {
                var h = sel.node().getBBox().height,
                    x = sel.attr('x'),
                    y = sel.attr('y');

                sel.text(null);

                for(var i = 0, l = tokens.length; i < l; i++) {
                    sel.append('tspan').attr('x', x).attr('y', y).attr('dy', h * i).text(tokens[i].trim());
                }
            }
        }
    };

    /**
     * Selects arc by its ID
     * @param id
     */
    Sunburst.prototype.select = function(id){
        selectArc(d3.select(this.el).select('.arc[data-id="' + id + '"]').node());
    };

    /**
     * Sets option on sunburst chart
     * @param name
     * @param value
     */
    Sunburst.prototype.setOption = function(name, value){
        this.opts[name] = value;
    };

    return Sunburst;
});