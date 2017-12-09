const _ = require('lodash');
const moment = require('moment');
const percent = require('percent');

const SC = require('./StockConstants');
const PeaksModel = require('./PeaksModel');

module.exports = {
    getColumn: getColumn,
    getStartedDate: getStartedDate,
    getLatestDate: getLatestDate,
    getLatest: getLatest,
    getColumnIndex: getColumnIndex,
    getMaximum: getMaximum,
    getMinimum: getMinimum,
    getAverage: getAverage,
    getMinMaxAverage: getMinMaxAverage,
    getTimeListed: getTimeListed,
    getHighestPeaks: getHighestPeaks,
    getLowestPeaks: getLowestPeaks,
    getGainLoss: getGainLoss,
    getGainLossAverage: getGainLossAverage,
    getVolatility: getVolatility,

    toMoment: toMoment,
    divideRows: divideRows


}

/**
 * gets the volatility of the close price by gainLoss percentage
 * @param {[]} d3Model 
 */
function getVolatility(d3Model) {
    let gainLossArr = getGainLoss(d3Model);
    let ave = _.reduce(gainLossArr, (sum, closePercent) => {
        return sum + Math.abs(closePercent);
    }, 0) / gainLossArr.length;
    return ave;
}

/**
 * gets the average of gain/loss per day of close price in percent %
 * @param {[]} d3Model 
 */
function getGainLossAverage(d3Model) {
    let gainLossArr = getGainLoss(d3Model);
    let ave = _.reduce(gainLossArr, (sum, closePercent) => {
        return sum + closePercent;
    }, 0) / gainLossArr.length;
    return ave;
}

/**
 * gets the list of gain/loss per day of close price in percent %
 * @param {[]} d3Model 
 */
function getGainLoss(d3Model) {
    let reversed = _.reverse(d3Model);
    let otherRow = +reversed[0].close;
    let gainLossArr = [];
    for (let i = 1; i < reversed.length; i++) {
        let row = +reversed[i].close;
        let diff = row - otherRow;
        let gainLoss = +percent.calc(diff,otherRow,2);
        gainLossArr.push(gainLoss);

        otherRow = row;
    }
    return gainLossArr;
}

/**
 * gets the lowest peaks of certain column given rows divided by days
 * @param {[]} d3Model 
 * @param {number} days
 * @param {string} columnName
 */
function getLowestPeaks(d3Model, days, columnName) {

    let dividedRows = divideRows(d3Model, days);
    let lowestPeaks = [];

    _.forEach(dividedRows, group => {
        let minRow = _.minBy(group, (row) => +row[columnName]);
        lowestPeaks.push(minRow);
    });

    return new PeaksModel(SC.PEAK_LOWEST, days, columnName, lowestPeaks);
}

/**
 * gets the highest peaks of certain column given rows divided by days
 * @param {[]} d3Model 
 * @param {number} days
 * @param {string} columnName
 */
function getHighestPeaks(d3Model, days, columnName) {

    let dividedRows = divideRows(d3Model, days);
    let highestPeaks = [];

    _.forEach(dividedRows, group => {
        let maxRow = _.maxBy(group, (row) => +row[columnName]);
        highestPeaks.push(maxRow);
    });

    return new PeaksModel(SC.PEAK_HIGHEST, days, columnName, highestPeaks);
}

/**
 * divide rows per number of days starting from the latest
 * @param {[]} d3Model 
 * @param {number} days
 */
function divideRows(d3Model, days) {
    if (days < 1) return undefined;

    let dividedRows = [];
    let group = [];
    let counter = 1;
    _.forEach(d3Model, (row,index) => {
        if (counter > days) {
            counter = 1;
            dividedRows.push(group);
            group = [];
        } else if (index === d3Model.length - 1) {
            group.push(row);
            dividedRows.push(group);
            return;
        }

        group.push(row);
        counter++;
    });
    return dividedRows;
}

/**
 * gets the time listed of the given stock security in format Y year/s and M month/s
 * @param {[]} d3Model 
 */
function getTimeListed(d3Model) {
    let started = getStartedDate(d3Model);
    let latest = getLatestDate(d3Model);

    let duration = moment.duration(latest.diff(started));
    let years = Math.floor(duration.asYears());
    let months = Math.floor(duration.asMonths());
    return SC.TIME_LISTED_FORMAT.replace("[Y]", years).replace("[M]", months);
}


/**
 * converts date to moment using momentjs
 * @param {string} dateString 
 */
function toMoment(dateString, format) {
    return moment(dateString, format);
}

/**
 * gets the average of the min and max values of a column given column name
 * @param {[]} d3Model 
 * @param {string} columnName 
 */
function getMinMaxAverage(d3Model, columnName) {

    let min = getMinimum(d3Model, columnName);
    let max = getMaximum(d3Model, columnName);
    return (min + max) / 2;
}

/**
 * gets the average of the values of a column given column name
 * @param {[]} d3Model 
 * @param {string} columnName 
 */
function getAverage(d3Model, columnName) {

    return _.reduce(d3Model, (total, row) => {
        return total + +row[columnName];
    }, 0) / d3Model.length;
}

/**
 * gets the minimum value of a column given column name
 * @param {[]]} d3Model 
 * @param {string} columnName 
 */
function getMinimum(d3Model, columnName) {

    return _.chain(d3Model)
        .map(row => {
            return +row[columnName];
        })
        .min().value();
}

/**
 * gets the maximum value of a column given column name
 * @param {[]} d3Model 
 * @param {string} columnName 
 */
function getMaximum(d3Model, columnName) {

    return _.chain(d3Model)
        .map(row => {
            return +row[columnName];
        })
        .max().value();
}

/**
 * gets the latest value of a column given column name
 * @param {[]} d3Model 
 * @param {string} columnName 
 */
function getLatest(d3Model, columnName) {
    return +_.first(d3Model)[columnName];
}

/**
 * @deprecated since version 2.0
 * @param {HPModel} hpModel 
 * @param {string} columnName 
 */
function getColumnIndex(hpModel, columnName) {
    columnName = columnName.trim().toLowerCase();
    let columnIndex = -1;
    _.forEach(hpModel.headers, (header, index) => {
        if (header.trim().toLowerCase() === columnName) columnIndex = index;
    });

    return columnIndex;
}

/**
 * gets data given column header name
 * @param {[]} d3Model 
 * @param {string} columnName 
 */
function getColumn(d3Model, columnName) {
    return _.map(d3Model, (row) => {
        return row[columnName];
    });
}

/**
 * Gets the started date of the historical price
 * @param {[]} d3Model 
 */
function getStartedDate(d3Model) {
    return _.last(d3Model).date;
}

/**
 * Gets the latest date of the historical price
 * @param {[]} d3Model 
 */
function getLatestDate(d3Model) {
    return _.first(d3Model).date;
}

