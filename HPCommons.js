const _ = require('lodash');
const moment = require('moment');
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
    
    toMoment: toMoment,
    divideRows: divideRows
}

/**
 * gets the lowest peaks of certain column given rows divided by days
 * @param {HPModel} hpModel 
 * @param {number} days
 * @param {string} columnName
 */
function getLowestPeaks(hpModel, days, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    let dividedRows = divideRows(hpModel, days);
    let lowestPeaks = [];

    _.forEach(dividedRows, group => {
        let minRow = _.minBy(group, (row) => +row[columnIndex]);
        lowestPeaks.push(minRow);
    });

    return new PeaksModel(SC.PEAK_LOWEST, days, columnName, columnIndex, lowestPeaks);
}

/**
 * gets the highest peaks of certain column given rows divided by days
 * @param {HPModel} hpModel 
 * @param {number} days
 * @param {string} columnName
 */
function getHighestPeaks(hpModel, days, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    let dividedRows = divideRows(hpModel, days);
    let highestPeaks = [];

    _.forEach(dividedRows, group => {
        let maxRow = _.maxBy(group, (row) => +row[columnIndex]);
        highestPeaks.push(maxRow);
    });

    return new PeaksModel(SC.PEAK_HIGHEST, days, columnName, columnIndex, highestPeaks);
}

/**
 * divide rows per number of days starting from the latest
 * @param {HPModel} hpModel 
 * @param {number} days
 */
function divideRows(hpModel, days) {
    if (days < 1) return undefined;

    let dividedRows = [];
    let group = [];
    let counter = 1;
    _.forEach(hpModel.data, (row,index) => {
        if (counter > days) {
            counter = 1;
            dividedRows.push(group);
            group = [];
        } else if (index === hpModel.data.length - 1) {
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
 * @param {HPModel} hpModel 
 */
function getTimeListed(hpModel) {
    let started = getStartedDate(hpModel);
    let latest = getLatestDate(hpModel);

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
 * @param {HPModel} hpModel 
 * @param {string} columnName 
 */
function getMinMaxAverage(hpModel, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    let min = getMinimum(hpModel, columnName);
    let max = getMaximum(hpModel, columnName);
    return (min + max) / 2;
}

/**
 * gets the average of the values of a column given column name
 * @param {HPModel} hpModel 
 * @param {string} columnName 
 */
function getAverage(hpModel, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    return _.reduce(hpModel.data, (total, row) => {
        return total + +row[columnIndex];
    }, 0) / hpModel.data.length;
}

/**
 * gets the minimum value of a column given column name
 * @param {HPModel} hpModel 
 * @param {string} columnName 
 */
function getMinimum(hpModel, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    return _.chain(hpModel.data)
        .map(row => {
            return +row[columnIndex];
        })
        .min().value();
}

/**
 * gets the maximum value of a column given column name
 * @param {HPModel} hpModel 
 * @param {string} columnName 
 */
function getMaximum(hpModel, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    return _.chain(hpModel.data)
        .map(row => {
            return +row[columnIndex];
        })
        .max().value();
}

/**
 * gets the latest value of a column given column name
 * @param {HPModel} hpModel 
 * @param {string} columnName 
 */
function getLatest(hpModel, columnName) {
    let columnIndex = getColumnIndex(hpModel, columnName);
    if (columnIndex === -1) return undefined;

    return _.first(hpModel.data)[columnIndex];
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

