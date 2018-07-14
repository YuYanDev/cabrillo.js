var cabrilloCore = require('../dist/cabrillo')
var fs = require('fs')

var NAQP=fs.readFileSync('./example/NAQP_Cabrillo_Template.txt','utf-8');
var CQWPX=fs.readFileSync('./example/CQWPX.txt','utf-8');
var dafaultTemplate=fs.readFileSync('./example/default.txt','utf-8');


var option = {
    contest:'NAQP'
}

var NAQPJSON = {"CABRILLO-VERSION":"3.0","CONTEST":"NAQP-CW","LOCATION":"CA","CALLSIGN":"N5KO","CATEGORY-OPERATOR":"SINGLE-OP","CATEGORY-TRANSMITTER":"ONE","CATEGORY-ASSISTED":"NON-ASSISTED","CATEGORY-BAND":"ALL","CATEGORY-POWER":"LOW","CATEGORY-MODE":"CW","CATEGORY-STATION":"FIXED","CLAIMED-SCORE":"404670","NAME":"Trey Garlough","SOAPBOX":[{"SOAPBOX":""}],"QSO":[{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1800","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"N4PN","rcvdname":"PAUL","rcvdexch":"GA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1800","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"VE3NZ","rcvdname":"BEN","rcvdexch":"ON"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1801","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"K6DGW","rcvdname":"SKIP","rcvdexch":"CA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1801","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"AA4LR","rcvdname":"BILL","rcvdexch":"GA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1802","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"K6RB","rcvdname":"ROB","rcvdexch":"CA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1802","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"WA1S","rcvdname":"ANN","rcvdexch":"GA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1802","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"AF8A","rcvdname":"GARY","rcvdexch":"OH"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1802","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"W6CT","rcvdname":"SCOTT","rcvdexch":"CA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1803","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"K6GHA","rcvdname":"DON","rcvdexch":"CA"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1803","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"HI8A","rcvdname":"AKI","rcvdexch":"DX"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1803","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"W2CDO","rcvdname":"PETER","rcvdexch":"MD"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1804","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"NE8J","rcvdname":"HOWARD","rcvdexch":"MI"},{"freq":"21048","mo":"CW","date":"2014-01-11","time":"1804","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"KH6LC","rcvdname":"LLOYD","rcvdexch":"HI"},{"freq":"28048","mo":"CW","date":"2014-01-11","time":"1804","sentcall":"N5KO","sentname":"TREY","sentexch":"CA","rcvdcall":"K8JQ","rcvdname":"STEVE","rcvdexch":"WV"}]}
var CQWPXJSON = {"CABRILLO-VERSION":"3.0","CALLSIGN":"AA1ZZZ","CONTEST":"CQ-WPX-CW","CATEGORY-OPERATOR":"SINGLE-OP","CATEGORY-ASSISTED":"NON-ASSISTED","CATEGORY-BAND":"ALL","CATEGORY-POWER":"HIGH","CATEGORY-MODE":"CW","CATEGORY-TRANSMITTER":"ONE","CATEGORY-OVERLAY":"TB-WIRES","CLAIMED-SCORE":"24","CLUB":"Yankee Clipper Contest Club","LOCATION":"WMA","CREATED-BY":"WriteLog V10.72C","NAME":"Randy Thompson","ADDRESS":"11 Hollis Street","ADDRESS-CITY":"Uxbridge","ADDRESS-STATE-PROVINCE":"MA","ADDRESS-POSTALCODE":"01569","ADDRESS-COUNTRY":"USA","OPERATORS":"K5ZD","SOAPBOX":[{"SOAPBOX":"Put your comments here."},{"SOAPBOX":"Use multiple lines if needed."}],"QSO":[{"freq":"3799","mo":"PH","date":"1999-03-06","time":"0711","sentcall":"HC8N","sentrst":"59","sentexch":"001","rcvdcall":"W1AW","rcvdrst":"59","rcvdexch":"001","t":"0"},{"freq":"3799","mo":"PH","date":"1999-03-06","time":"0711","sentcall":"HC8N","sentrst":"59","sentexch":"001","rcvdcall":"W1AW","rcvdrst":"59","rcvdexch":"001","t":"0"},{"freq":"3799","mo":"PH","date":"1999-03-06","time":"0711","sentcall":"HC8N","sentrst":"59","sentexch":"001","rcvdcall":"W1AW","rcvdrst":"59","rcvdexch":"001","t":"0"},{"freq":"3799","mo":"PH","date":"1999-03-06","time":"0711","sentcall":"HC8N","sentrst":"59","sentexch":"001","rcvdcall":"W1AW","rcvdrst":"59","rcvdexch":"001","t":"0"}]}

fs.writeFile("./example/output.txt", cabrilloCore.objectToCabrillo(NAQPJSON,option), err =>{
    if(err) throw err;
    console.log("Success! Output in "+"'./example/output.txt'");
} )

fs.writeFile('./example/output.json', JSON.stringify(cabrilloCore.cabrilloToObject(NAQP,option), null, 4), err => {
    if(err) throw err;
    console.log("Success! Output in "+"'./example/output.json'");
});
