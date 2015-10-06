define([], function () {
    /**
     * Extracts indicators for particular university and category and preapres it
     * for using with Sunburst chart
     *
     * @param dataset {Object} - Initial dataset object
     * @param university {number} - Id of the currently selected university
     * @param category {number} - Id of the currently selected university
     * @param arcDelta - Delta angle between rays
     */
    return function (dataset, university, category, arcDelta) {
        var category = dataset.getCategory(university, category),
            indicators = category.indicators,
            count = indicators.length;

        var arcAngle = (2 * Math.PI - count * arcDelta) / count;


        return indicators.map(function (d, index) {
            var startAngle = index * (arcDelta + arcAngle);

            return {
                name : d.name,
                longname : d.longname,
                catid : category.id,
                size : d.value,
                startAngle: startAngle,
                angle: startAngle + arcAngle / 2,
                deltaAngle: arcAngle
            }
        });
    }
});