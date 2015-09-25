define(['lodash/collection/map', 'lodash/array/flatten', 'lodash/collection/find'], function(map, flatten, find){
    /**
     * Takes all categories from university, each one with all indicator values and produces dataset
     * for sunburst chart - adds startAngle / deltaAngle properties and if of the category for each indicator
     * Returns flatten array of all indocators
     *
     * @param   categories      Categories each with indicators collection
     * @param   groupDelta      Delta angle between groups
     * @param   arcDelta        Delta angle between rays
     * @param   valueType       Type of the value to use. COuld be one of the following: RANK, PERCENT, STANDARTIZED
     */
    return function(categories, groupDelta, arcDelta, valueType){
        var grouped = [];

        for(var i = 0, l = categories.length; i < l; i++){
            var cat = categories[i];
            grouped.push(map(cat.indicators, function(d){
                return {
                    name : d.name,
                    catname : cat.name,
                    catid : cat.id,
                    size : find(d.values, function(_d){ return _d.type == valueType}).value
                }
            }));
        }

        var dataset = flatten(grouped),
            groupCount = grouped.length,
            totalCount = dataset.length;

        var arcAngle = (2 * Math.PI - groupCount * groupDelta - (totalCount - groupCount) * arcDelta) / totalCount;

        // iterates over all groups
        var startAngle = 0;
        for (var i = 0, l = grouped.length; i < l; i++) {
            var data = grouped[i];

            for(var k = 0, ll = data.length; k < ll; k++){
                var d = data[k];
                d.startAngle = startAngle;
                d.deltaAngle = arcAngle;

                startAngle += arcDelta + arcAngle;
            }

            // remove last delta in group
            startAngle -= arcDelta;
            startAngle += groupDelta;
        }

        return dataset;
    }
})