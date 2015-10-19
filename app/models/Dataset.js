define(['exports', 'text!data/university.json'], function (exports, uds) {
    var ds = JSON.parse(uds);

    /**
     * Takes object from the collection by its id, assuming that each object has an id property
     *
     * @param arr
     */
    function byId(arr, id){
        return arr.find(function(d){ return d.id == id});
    }

    /**
     * Returns universities as collection of objects {id : name : }
     * @returns {Array}
     */
    exports.getUniversities = function () {
        return ds.universities.map(function (d) {
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
     * Returns category for university specified by university id and category id
     *
     * @param uid       ID of the university
     * @param catid     ID of the category
     * @returns {Array}
     */
    exports.getCategory = function (uid, catid) {
        return byId(byId(ds.universities, uid).categories, catid);
    }

    /**
     * Returns all categories with indicators for particular university
     * @param university
`     */
    exports.getCategories = function(uid){
        return byId(ds.universities, uid).categories;
    }

    /**
     * Returns details about category specified by id
     * @param catid
     * @return {*}
     */
    exports.getCategoryDetails = function(catid){
        return ds.categories[catid];
    }

    /**
     * Returns indicator details by its ID
     * @param indid
     * @return {*}
     */
    exports.getIndicatorDetails = function(indid){
       return ds.indicators[indid];
    }
});