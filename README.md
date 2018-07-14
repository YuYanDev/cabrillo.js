# Cabrillo.js

---

[![npm](https://img.shields.io/npm/v/cabrillo.svg)](https://www.npmjs.com/package/cabrillo) [![npm](https://img.shields.io/npm/dt/cabrillo.svg)](https://www.npmjs.com/package/cabrillo) [![downloads](https://img.shields.io/github/downloads/YuYanDev/cabrillo.js/total.svg)](https://www.npmjs.com/package/cabrillo)
 * Now support CQWW series,CQWPX series,NAQP and Standard template log
 * works in a browser, on a server

### Introduction
---
Cabrillo.js is a JavaScript library that converts cabrillo contest files and json to each other.

### Installation
---
Currently only npm installation is supported

`npm install cabrillo --save`

### Usage
---

Convert JSON objects into cabrillo's standard format string

`objectToCabrillo(json,option)`

Example:
``` js
var cabrillo = require('cabrillo')
var fs = require('fs') // if in Node.js
var data = fs.readFileSync('contest.json')

var option = {
    contest:'NAQP'
}

fs.writeFile("contest.txt", cabrilloCore.objectToCabrillo(data,option), err =>{
    if(err) throw err;
    console.log("Success!");
} )

```

Convert a cabrillo string to a json object

`cabrilloToObject(String,option)`

Example:
``` js
var cabrillo = require('cabrillo')
var fs = require('fs') // if in Node.js
var data = fs.readFileSync('contest.txt')

var option = {
    contest:'NAQP'
}

fs.writeFile('contest.json', JSON.stringify(cabrilloCore.cabrilloToObject(data,option), null, 4), err => {
    if(err) throw err;
    console.log("Success!");
});
```

### Example
---
The sample file example.js is stored in the example folder.
``` bash
git clone https://github.com/YuYanDev/cabrillo.js
cd cabrillo.js
npm run example
```

### License
---

[Apache 2.0](https://opensource.org/licenses/Apache-2.0)

Created by YuYan ( DE BG6TTI - K6TTI )
