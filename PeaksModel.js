/**
 * Model class for peaks
 */
class PeaksModel {
    
    /**
     * 
     * @param {string} peakType 
     * @param {number} days
     * @param {string} columnName 
     * @param {number} columnIndex
     * @param {number} length
     * @param {[]} peaks
     */
    constructor(peakType, days, columnName, columnIndex, peaks) {
        this.peakType = peakType;
        this.days = days;
        this.columnName = columnName;
        this.columnIndex = columnIndex;
        this.length = peaks.length;
        this.peaks = peaks;
    }
}

module.exports = PeaksModel;