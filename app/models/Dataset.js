define(['exports', 'text!data/university.json', 'lodash/collection/find', 'lodash/collection/map'], function (exports, uds, find, map) {
    var ds = JSON.parse(uds);

    /**
     * Takes object from the collection by its id, assuming that each object has an id property
     *
     * @param arr
     */
    function byId(arr, id){
        return find(arr, function(d){ return d.id == id});
    }

    /**
     * Returns universities as collection of objects {id : name : }
     * @returns {Array}
     */
    exports.getUniversities = function () {
        return map(ds.universities, function (d) {
            return { id : d.id, name: d.name}
        });
    }

    /**
     * Returns collection of indicators for university specified by ID and
     * category, specified by ID
     *
     * @param uid       ID of the university
     * @param catid     ID of the category
     * @returns {Array}
     */
    exports.getIndicators = function (uid, catid) {
        return byId(byId(ds.universities, uid).categories, catid).indicators;
    }

    /**
     * Returns all categories with indicators for particular university
     * @param university
     */
    exports.getCategories = function(uid){
        return byId(ds.universities, uid).categories;
    }
});