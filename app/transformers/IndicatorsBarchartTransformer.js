define(['lodash/collection/map', 'lodash/collection/find'], function(map, find){
    /**
     * Takes indicators collection and returns transformation function that takes full information about indicators and
     * type of the value and returns it in format [{id, name : , value}]
     *
     * @param   indicators      Collection of indicators from dataset
     * @param   valueType       Type of the value to use. COuld be one of the following: RANK, PERCENT, STANDARTIZED
     */
    return function(indicators, valueType){
        return map(indicators, function(d){
            return {
                id : d.id,
                name : d.name,
                value : find(d.values, function(_d){ return _d.type == valueType}).value
            }
        });
    }
});