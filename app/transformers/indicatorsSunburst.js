define(['util/i18nValue'], function (i18nValue) {

    /**
     * Extracts indicators for particular university and category and preapres it
     * for using with Sunburst chart
     *
     * @param dataset {Object} - Initial dataset object
     * @param university {number} - Id of the currently selected university
     * @param category {number} - Id of the currently selected university
     * @param arcDelta - Delta angle between rays
     * @param startAngle - Angle where to start rays - 0 by default
     * @param endAngle - Angle where to end rays - 2*PI by default
     *
     * @TODO: a lot of arguments - transform to opts (eg all angles to opts, as it is related to view, not data).
     *
     */
    return function (dataset, university, category, arcDelta, startAngle, endAngle, lang) {
        var category = dataset.getCategory(university, category),
            indicators = category.indicators,
            count = indicators.length;

        startAngle = startAngle || 0;
        endAngle = endAngle || 2 * Math.PI;

        var arcAngle = ((endAngle - startAngle) - count * arcDelta) / count;

        return indicators.map(function (d, index) {
            var _startAngle = startAngle + index * (arcDelta + arcAngle),
                details = dataset.getIndicatorDetails(d.id);

            return {
                id : d.id,
                name : i18nValue(details, 'name', lang),
                longname : i18nValue(details, 'longname', lang),
                catid : category.id,
                size : d.value,
                startAngle: _startAngle,
                angle: _startAngle + arcAngle / 2,
                deltaAngle: arcAngle
            }
        });
    }
});