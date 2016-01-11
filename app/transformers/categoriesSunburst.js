define(['util/i18nValue'], function (i18nValue) {

    /**
     * Creates categories data layout for sunburst from initial dataset
     *
     * @param dataset {Object} - Initial dataset object
     * @param university {number} - Id of the currently selected university
     * @param arcDelta        Delta angle between sunburst rays
     */
    return function (dataset, university, arcDelta, lang) {
        var categories = dataset.getCategories(university);

        var count = categories.length,
            arcAngle = (2 * Math.PI - count * arcDelta) / count;

        return dataset.getCategories(university).map(function (d, index) {
            var startAngle = index * (arcDelta + arcAngle),
                details = dataset.getCategoryDetails(d.id);

            return {
                id: d.id,
                name : i18nValue(details, 'name', lang),
                longname : i18nValue(details, 'longname', lang),
                size: d.score,
                startAngle: startAngle,
                endAngle : startAngle + arcAngle,
                deltaAngle: arcAngle
            }
        });
    }
});