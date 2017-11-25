
const Stock = require('../../doppelgunner-stock');
const HP = Stock.HP;
const HPModel = Stock.HPModel;
const HPCommons = Stock.HPCommons;
const SC = Stock.StockConstants;

const _ = require('lodash');


//TODO pass an array then encapsulate the download on load(downloader)
//TODO pass the stream so you can call the end callback etc
HP.load(HP.downloadWSJ('X',false,'PH'), funcCallback);

function funcCallback(hpModel) {
    new Promise((resolve,reject) => {
        resolve(hpModel);
    })

        //Uncomment one of the samples to test

        //SAMPLE of getLowestPeaks, gets peaks within range of 30 days or 1 month in close column
        // .then(x => HPCommons.getLowestPeaks(x, 30, 'close'))
        // .then(peaks => console.log(peaks));

        //SAMPLE of divided data by days, in the example group them per 5 days
        // .then(x => HPCommons.divideRows(x,5))
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
        // .then(d => console.log("latest:", d.latest, ",last:", d.last));

        //SAMPLE OF getColumn(hpModel, columnName)
        //.then(xurpas => HPCommons.getColumn(xurpas, 'date'))
        //.then(dateColumn => console.log(dateColumn));
}




