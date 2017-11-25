# doppelgunner-stock api
Api for getting historical-prices and analyzing its data.

## Samples

### Loading of historical prices from WSJ. 
* Note: internet is required
* Note: important to pass function callback to execute when downloading finished
```javascript
HP.load(HP.downloadWSJ('X',false,'PH'), funcCallback);
```

### Function callback
* Note: better to make promise for chaining
* Note: This sample extracts and displays all dates
```javascript
function funcCallback(hpModel) {
    new Promise((resolve,reject) => {
        resolve(hpModel);
    }).then(xurpas => HPCommons.getColumn(xurpas, 'date'))
      .then(dateColumn => console.log(dateColumn));
```

## Limitations
* Downloads from WSJ as of now
* Only historical-prices