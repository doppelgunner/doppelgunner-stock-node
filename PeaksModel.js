/**
 * Model class for peaks
 */
class PeaksModel {
    
    /**
     * 
     * @param {string} peakType 
     * @param {number} days
     * @param {string} columnName 
     * @param {number} length
     * @param {[]} peaks
     */
    constructor(peakType, days, columnName, peaks) {
        this.peakType = peakType;
        this.days = days;
        this.columnName = columnName;
        this.length = peaks.length;
        this.peaks = peaks;
    }
}

module.exports = PeaksModel;