const http = require('http');
const csv = require('fast-csv');
const dateFormat = require('dateformat');
const _ = require('lodash');
const request = require('superagent');

const HPModel = require('./HPModel');
const HPCommons = require('./HPCommons');
const SC = require('./StockConstants');


const logTitle = "HistoricalPrices:";

module.exports = {
    downloadWSJ: downloadWSJ,
    load: load
}

let now = dateFormat(new Date(), "mm/dd/yyyy");
let csvStream = csv();

function load(stream, funcCallback) {
    let histPricesArr = [];
    stream.on('data', (data) => {
        histPricesArr.push(data);
    })
    .on('end', () => {
        let hpModel = new HPModel(histPricesArr.shift(),histPricesArr);
        _.forEach(hpModel.data, row => {
            row[0] = HPCommons
                .toMoment(row[0], SC.DATE_FORMAT_WSJ);
        });
        funcCallback(hpModel);
    });
}

/**
 * downloads historical prices from WSJ
 * @param {string} stockCode 
 * @param {boolean} isIndex 
 * @param {string} country 
 */
function downloadWSJ(stockCode, isIndex, country) {
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
    let req = request.get(sampleUrl).withCredentials();
    req.pipe(csvStream);

    console.log(logTitle, 'getting historical prices from ' + sampleUrl);
    return csvStream;
}

