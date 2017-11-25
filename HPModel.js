
/**
 * Model class for Historical prices in-memory data
 */
class HPModel {
    
    /**
     * 
     * @param {string[]} headers 
     * @param {[]} data 
     */
    constructor(headers, data) {
        this.headers = headers;
        this.data = data;
    }
}

module.exports = HPModel;