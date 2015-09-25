define(['lodash/collection/map'], function(map){
    /**
     * Takes all categories and returns in format for sunburst
     * @param   categories      Collection of categories from dataset
     * @param   arcDelta        Delta angle between sunburst rays
     */
    return function (categories, arcDelta) {
        var count = categories.length,
            arcAngle = (2 * Math.PI - count * arcDelta) / count;

        return map(categories, function(d, index){
            return {
                id : d.id,
                name : d.name,
                size : d.score,
                startAngle : index * (arcDelta + arcAngle),
                deltaAngle : arcAngle
            }
        })
    }
});