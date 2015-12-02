define([], function () {

    /**
     * Takes object from the collection by its id, assuming that each object has an id property
     *
     * @param arr
     */
    function byId(arr, id){
        return arr.find(function(d){ return d.id == id});
    }

    function Dataset(uds){
        this.ds = JSON.parse(uds);
    }

    /**
     * Returns universities as collection of objects {id : name : }
     * @returns {Array}
     */
    Dataset.prototype.getUniversities = function () {
        return this.ds.universities.map(function (d) {
            return { id : d.id, name: d.name}
        });
    };

    /**
     * Returns collection of indicators for university specified by ID and
     * category, specified by ID
     *
     * @param uid       ID of the university
     * @param catid     ID of the category
     * @returns {Array}
     */
    Dataset.prototype.getIndicators = function (uid, catid) {
        return byId(byId(this.ds.universities, uid).categories, catid).indicators;
    };

    /**
     * Returns category for university specified by university id and category id
     *
     * @param uid       ID of the university
     * @param catid     ID of the category
     * @returns {Array}
     */
    Dataset.prototype.getCategory = function (uid, catid) {
        return byId(byId(this.ds.universities, uid).categories, catid);
    };

    /**
     * Returns all categories with indicators for particular university
     * @param university
`     */
    Dataset.prototype.getCategories = function(uid){
        return byId(this.ds.universities, uid).categories;
    };

    /**
     * Returns details about category specified by id
     * @param catid
     * @return {*}
     */
    Dataset.prototype.getCategoryDetails = function(catid){
        return this.ds.categories[catid];
    };

    /**
     * Returns indicator details by its ID
     * @param indid
     * @return {*}
     */
    Dataset.prototype.getIndicatorDetails = function(indid){
       return this.ds.indicators[indid];
    };

    return Dataset;
});