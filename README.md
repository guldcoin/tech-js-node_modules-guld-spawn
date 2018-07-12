# guld-spawn

Promisified process spawner for node or chrome native messenger. Chrome native messenger must be installed and called from a paired chrome extension.

With stdin support and optional stderr redirect to stdout.

### Usage

``` JS
const {getSpawn, nodeSpawn, chromeSpawn} = require('guld-spawn')

// either nodeSpawn or chromeSpawn depending on environment
var spawn = getSpawn()

// note: this is not an async function, for brevity
var stdout = await spawn('ledger', '', ['.f', 'ledger.dat', 'bal'])
```

