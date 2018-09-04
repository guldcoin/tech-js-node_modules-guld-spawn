# guld-spawn

[![source](https://img.shields.io/badge/source-bitbucket-blue.svg)](https://bitbucket.org/guld/tech-js-node_modules-guld-spawn) [![issues](https://img.shields.io/badge/issues-bitbucket-yellow.svg)](https://bitbucket.org/guld/tech-js-node_modules-guld-spawn/issues) [![documentation](https://img.shields.io/badge/docs-guld.tech-green.svg)](https://guld.tech/lib/guld-spawn.html)

[![node package manager](https://img.shields.io/npm/v/guld-spawn.svg)](https://www.npmjs.com/package/guld-spawn) [![travis-ci](https://travis-ci.org/guldcoin/tech-js-node_modules-guld-spawn.svg)](https://travis-ci.org/guldcoin/tech-js-node_modules-guld-spawn?branch=guld) [![lgtm](https://img.shields.io/lgtm/grade/javascript/b/guld/tech-js-node_modules-guld-spawn.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/b/guld/tech-js-node_modules-guld-spawn/context:javascript) [![david-dm](https://david-dm.org/guldcoin/tech-js-node_modules-guld-spawn/status.svg)](https://david-dm.org/guldcoin/tech-js-node_modules-guld-spawn) [![david-dm](https://david-dm.org/guldcoin/tech-js-node_modules-guld-spawn/dev-status.svg)](https://david-dm.org/guldcoin/tech-js-node_modules-guld-spawn?type=dev)

Promisified process spawner for node or chrome native messenger. Chrome native messenger must be installed and called from a paired chrome extension.

With stdin support and optional stderr redirect to stdout.

### Install

##### Node

```sh
npm i guld-spawn
```

### Usage

``` JS
const {getSpawn, nodeSpawn, chromeSpawn} = require('guld-spawn')

// either nodeSpawn or chromeSpawn depending on environment
var spawn = getSpawn()

// note: this is not an async function, for brevity
var stdout = await spawn('ledger', '', ['.f', 'ledger.dat', 'bal'])
```

### License

MIT Copyright isysd <public@iramiller.com>

