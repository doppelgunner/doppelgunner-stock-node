
const Stock = require('../../doppelgunner-stock');
const HP = Stock.HP;
const HPModel = Stock.HPModel;
const HPCommons = Stock.HPCommons;
const SC = Stock.StockConstants;

const _ = require('lodash');
const d3dsv = require('d3-dsv');

// let data = `date, high, low, open, close, volume
// November, 10, 5, 8, 9, 1000
// December, 20, 5, 5, 3.5, 2000`;
// let parsed = d3dsv.csvParse(data);
// console.log(parsed.length);

//TODO pass an array then encapsulate the download on load(downloader)
//TODO pass the stream so you can call the end callback etc
HP.load(HP.downloadWSJ('X',false,'PH'), funcCallback);
function funcCallback(d3Model) {
    new Promise((resolve,reject) => {
        resolve(d3Model);
    })

        
        //Uncomment one of the samples to test
        //SAMPLE of getVolatility, gets the volatility of the stock price of the company
        // .then(x => HPCommons.getVolatility(x))
        // .then(volatility => console.log(volatility));

        //SAMPLE of getGainLossAverage, gets the average of gain/loss per day
        .then(x => HPCommons.getGainLossAverage(x))
        .then(ave => console.log(ave));

        //SAMPE of getGainLoss, gets gain/loss per day of close column
        // .then(x => HPCommons.getGainLoss(x))
        // .then(gainLoss => console.log(gainLoss));

        //SAMPLE of getLowestPeaks, gets peaks within range of 30 days or 1 month in close column
        // .then(x => HPCommons.getLowestPeaks(x, 150, 'close'))
        // .then(peaks => console.log(peaks));

        //SAMPLE of getHighestPeaks
        // .then(x => HPCommons.getHighestPeaks(x, 150, 'close'))
        // .then(peaks => console.log(peaks));

        //SAMPLE of divided data by days, in the example group them per 5 days
        // .then(x => {
        //     console.log("total: " + x.length);
        //     return HPCommons.divideRows(x,5);
        // })
        // .then(divided => {
        //     let toPrint = '';
        //     _.forEach(divided, group => {
        //         toPrint += group.length + " ";
        //     });
        //     console.log(divided.length + " OF " + toPrint);
        // });

        //SAMPLE OF getTimeListed(hpModel);
        // .then(x => HPCommons.getTimeListed(x))
        // .then(timeListed => console.log(timeListed));

        //SAMPLE OF get min,max,ave,minMaxAve,latest using methodName(hpModel,columnName);
        // .then(xurpas => {
        //     let latest = HPCommons.getLatest(xurpas, 'close');
        //     let max = HPCommons.getMaximum(xurpas, 'close');
        //     let min = HPCommons.getMinimum(xurpas, 'close');
        //     let average = HPCommons.getAverage(xurpas, 'close');
        //     let minMaxAverage = HPCommons.getMinMaxAverage(xurpas, 'close');
        //     return {
        //         latest: latest,
        //         max: max,
        //         min: min,
        //         average: average,
        //         minMaxAverage: minMaxAverage
        //     }
        // })
        // .then(data => console.log(data));

        //SAMPLE OF GET START AND END DATE getStartedDate(hpModel) and getLatestDate(hpModel)
        // .then(xurpas => 
        //     { return {
        //         last: HPCommons.getStartedDate(xurpas),
        //         latest: HPCommons.getLatestDate(xurpas)
        //     }})
        // .then(d => console.log("latest:", d.latest, ", last:", d.last));

        //SAMPLE OF getColumn(hpModel, columnName)
        // .then(xurpas => HPCommons.getColumn(xurpas, 'date'))
        // .then(dateColumn => console.log(dateColumn));
}




