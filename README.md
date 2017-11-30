# doppelgunner-stock api
Api for getting historical-prices and analyzing its data.

## Installation
```
npm install --save doppelgunner-stock
```

## Samples

### Loading of historical prices from WSJ. 
* Note: internet is required
* Note: important to pass function callback to execute when downloading finished
```javascript
import { HP, HPCommons, HPModel } from 'doppelgunner-stock';

HP.load(HP.downloadWSJ('X',false,'PH'), funcCallback);
```

OR

```javascript
HP.load(HP.downloadWSJ('X',false,'PH'), () => {/*something to do here*/});
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
}
```

## Limitations
* Downloads from WSJ as of now
* Only historical-prices
