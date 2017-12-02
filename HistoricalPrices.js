const http = require('http');
const csv = require('fast-csv');
const dateFormat = require('dateformat');
const _ = require('lodash');
const request = require('superagent');
const d3dsv = require('d3-dsv');

const HPCommons = require('./HPCommons');
const SC = require('./StockConstants');


const logTitle = "HistoricalPrices:";

module.exports = {
    downloadWSJ: downloadWSJ,
    load: load
}

let now = dateFormat(new Date(), "mm/dd/yyyy");

function load(stream, funcCallback) {
    let histPricesArr = [];
    stream.on('data', (data) => {
        let str = ("" + data).trim().replace(/\s/g, "");
        histPricesArr.push(str);
    })
    .on('end', () => {
        let joinedArr = histPricesArr.join("\n").toLowerCase();
        let result = d3dsv.csvParse(joinedArr);
        _.forEach(result, row => {
            row.date = HPCommons.toMoment(row.date, SC.DATE_FORMAT_WSJ);
        });
        funcCallback(result);
    });
}

/**
 * downloads historical prices from WSJ
 * @param {string} stockCode 
 * @param {boolean} isIndex 
 * @param {string} country 
 */
function downloadWSJ(stockCode, isIndex, country) {
    let csvStream = csv();
    if (country) {
        country = '/' + country;
    } else {
        country = '';
    }

    if (isIndex) {
        country = '/index/' + country;
    }

    let sampleUrl = `http://quotes.wsj.com${country}/${stockCode}/historical-prices/download?MOD_VIEW=page&num_rows=50128&range_days=50128&startDate=08/25/1880&endDate=${now}`;
    //http.get(sampleUrl, (res) => res.pipe(csvStream));
    let req = request.get(sampleUrl);
    req.pipe(csvStream);

    console.log(logTitle, 'getting historical prices from ' + sampleUrl);
    return csvStream;
}

