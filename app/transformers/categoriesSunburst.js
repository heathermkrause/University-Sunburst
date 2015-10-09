define([], function () {

    /**
     * Creates categories data layout for sunburst from initial dataset
     *
     * @param dataset {Object} - Initial dataset object
     * @param university {number} - Id of the currently selected university
     * @param arcDelta        Delta angle between sunburst rays
     */
    return function (dataset, university, arcDelta) {
        var categories = dataset.getCategories(university);

        var count = categories.length,
            arcAngle = (2 * Math.PI - count * arcDelta) / count;


        return dataset.getCategories(university).map(function (d, index) {
            var startAngle = index * (arcDelta + arcAngle);

            return {
                id: d.id,
                name: d.name,
                size: d.score,
                startAngle: startAngle,
                endAngle : startAngle + arcAngle,
                deltaAngle: arcAngle
            }
        });
    }
});