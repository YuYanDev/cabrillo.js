/**
 * Currently supported contest formats
 * 
 * Now support CQWW series,CQWPX series,NAQP and Standard template
 */

var contestList = ['CQWW','CQWPX','NAQP']

/**
 * Function that outputs spaces
 * 
 * @param {number} num 
 */

function creatSpace(num){
  var string = ''
  for(var i = 0;i<num;i++){
    string = string + ' ';
  }
  return string;
}

/**
 * Format qso's tabulation function
 * (for format is not mandatory)
 * 
 * @param {string} fieldValue Input string
 * @param {number} fieldLength Total length
 * @param {string} align The default is left alignment, If you need right alignment, you need to pass in the ‘right’ parameter.
 * @returns bool or string
 */

function creatVariableQsoField(fieldValue,fieldLength,align){
  if(fieldValue.length == parseInt(fieldLength)){
    return fieldValue
  }
  if(fieldValue.length < parseInt(fieldLength)){
    if(align && align=='right'){
      return creatSpace(parseInt(fieldLength)-fieldValue.length) + fieldValue 
    }else{
      return fieldValue + creatSpace(parseInt(fieldLength)-fieldValue.length)
    }
     
  }
  if(fieldValue.length > parseInt(fieldLength)||fieldValue.length == 0 ){
    return false
  }
}

/**
 * Format qso's tabulation function
 * (for format is mandatory)
 * 
 * @param {string} fieldValue Input string
 * @param {number} fieldLength Total length
 * @returns bool or string
 */

function creatUnvariableQsoField(fieldValue,fieldLength){
  if(fieldValue.length == parseInt(fieldLength)){
    return fieldValue
  }
  if(fieldValue.length > parseInt(fieldLength)||fieldValue.length == 0 ){
    return false
  }
}

/**
 * Convert a cabrillo string to a json object
 * 
 * @param {string} cabrilloString  cabrillo String  
 * @param {object} option  Option, currently only supports the specified contest, view the document for details
 * @returns object
 */

function cabrilloToObject(cabrilloString,option) {
  var contest;
  if(option){
    // Judging the type of competition
    if(option.contest && contestList.indexOf(option.contest)!=-1){
      contest = option.contest
    }else{
      contest = 'default'
    }
  }else{
    contest = 'default'
  }
  var returnObject = {};
  var cabrilloItemArray = cabrilloString.split("\n");

  cabrilloItemArray.map(function (item) {
    if(item.indexOf("#") < 0){
      var itemSplitArray = item.split(':')
      switch (itemSplitArray[0]) {
        // Record the cabrillo version number
        case 'START-OF-LOG':
          {
            returnObject['CABRILLO-VERSION'] = itemSplitArray[1].slice(1)
            break;
          }
        // SOAPBOX has multiple lines and needs to be stored as an array
        case 'SOAPBOX':
          {
            if (!returnObject['SOAPBOX']) {
              returnObject['SOAPBOX'] = []
            }
            returnObject['SOAPBOX'].push({
              'SOAPBOX': itemSplitArray[1].slice(1)
            })

            break;
          }
        case 'ADDRESS':
          {
            if (!returnObject['ADDRESS']) {
              returnObject['ADDRESS'] = ''
            }
            returnObject['ADDRESS'] = returnObject['ADDRESS'] + itemSplitArray[1].slice(1)
            break;
          }
        case 'QSO':
          {
            if (!returnObject['QSO']) {
              returnObject['QSO'] = []
            }
            // Cabrillo default template, and its CQWW, CQWPX series competition
            if(contest=='default'||contest=='CQWW'||contest=='CQWPX'){
              returnObject['QSO'].push({
                freq: itemSplitArray[1].substr(1,5).replace(/\s+/g,""),
                mo: itemSplitArray[1].substr(7,2).replace(/\s+/g,""),
                date: itemSplitArray[1].substr(10,10).replace(/\s+/g,""),
                time: itemSplitArray[1].substr(21,4).replace(/\s+/g,""),
                sentcall: itemSplitArray[1].substr(26,13).replace(/\s+/g,""),
                sentrst: itemSplitArray[1].substr(40,3).replace(/\s+/g,""),
                sentexch: itemSplitArray[1].substr(44,6).replace(/\s+/g,""),
                rcvdcall: itemSplitArray[1].substr(51,13).replace(/\s+/g,""),
                rcvdrst: itemSplitArray[1].substr(65,3).replace(/\s+/g,""),
                rcvdexch: itemSplitArray[1].substr(69,6).replace(/\s+/g,""),
                t: itemSplitArray[1].substr(76,1).replace(/\s+/g,"")
              })
            }
            // NAQP competition format
            if(contest=='NAQP'){
              returnObject['QSO'].push({
                freq: itemSplitArray[1].substr(1,5).replace(/\s+/g,""),
                mo: itemSplitArray[1].substr(7,2).replace(/\s+/g,""),
                date: itemSplitArray[1].substr(10,10).replace(/\s+/g,""),
                time: itemSplitArray[1].substr(21,4).replace(/\s+/g,""),
                sentcall: itemSplitArray[1].substr(26,15).replace(/\s+/g,""),
                sentname: itemSplitArray[1].substr(42,10).replace(/\s+/g,""),
                sentexch: itemSplitArray[1].substr(53,3).replace(/\s+/g,""),
                rcvdcall: itemSplitArray[1].substr(57,15).replace(/\s+/g,""),
                rcvdname: itemSplitArray[1].substr(73,10).replace(/\s+/g,""),
                rcvdexch: itemSplitArray[1].substr(84,3).replace(/\s+/g,""),
              })
            }
            //
            // Reserve other contest formats
            // Reserve other contest formats
            //
            break;
          }
        case 'END-OF-LOG':
          {
            break;
          }
        default:
          {
            if (itemSplitArray[0].length != 0) {
              returnObject[itemSplitArray[0]] = itemSplitArray[1].slice(1)
            }
            break;
          }
      }
    }
  })
  return returnObject;
}

/**
 * Convert JSON objects into cabrillo's standard format string
 * 
 * @param {*} cabrilloObject 
 * @param {*} option Option, currently only supports the specified contest, view the document for details
 * @returns string 
 */
function objectToCabrillo(cabrilloObject, option){
  var contest;
  if(option){
    // Judging the type of competition
    if(option.contest && contestList.indexOf(option.contest)!=-1){
      contest = option.contest
    }else{
      contest = 'default'
    }
  }else{
    contest = 'default'
  }
  var returnString = '';
  var cabrilloVersion;

  // set version
  if(cabrilloObject["CABRILLO-VERSION"]){
    returnString = returnString + 'START-OF-LOG: ' + cabrilloObject["CABRILLO-VERSION"] + '\n'
    cabrilloVersion = cabrilloObject["CABRILLO-VERSION"]
  }else{
    returnString = returnString + 'START-OF-LOG: 3.0\n'
    cabrilloVersion = '3.0'
  }

  // set CONTEST
  if(cabrilloObject["CONTEST"]){
    returnString = returnString + 'CONTEST: ' + cabrilloObject['CONTEST'] + '\n'
  }

  // set CATEGORY while cabrillo is 2.0
  if(cabrilloObject['CATEGORY'] && cabrilloVersion == '2.0'){
    returnString = returnString + 'CATEGORY: ' + cabrilloObject['CATEGORY'] + '\n'
  }

  // set CALLSIGN
  if(cabrilloObject['CALLSIGN']){
    returnString = returnString + 'CALLSIGN: ' + cabrilloObject['CALLSIGN'] + '\n'
  }

  // set CATEGORY-OPERATOR
  if(cabrilloObject['CATEGORY-OPERATOR']){
    returnString = returnString + 'CATEGORY-OPERATOR: ' + cabrilloObject['CATEGORY-OPERATOR'] + '\n'
  }

  // set CATEGORY-ASSISTED
  if(cabrilloObject['CATEGORY-ASSISTED']){
    returnString = returnString + 'CATEGORY-ASSISTED: ' + cabrilloObject['CATEGORY-ASSISTED'] + '\n'
  }

  // set CATEGORY-BAND
  if(cabrilloObject['CATEGORY-BAND']){
    returnString = returnString + 'CATEGORY-BAND: ' + cabrilloObject['CATEGORY-BAND'] + '\n'
  }

  // set CATEGORY-POWER
  if(cabrilloObject['CATEGORY-POWER']){
    returnString = returnString + 'CATEGORY-POWER: ' + cabrilloObject['CATEGORY-POWER'] + '\n'
  }

  // set CATEGORY-MODE
  if(cabrilloObject['CATEGORY-MODE']){
    returnString = returnString + 'CATEGORY-MODE: ' + cabrilloObject['CATEGORY-MODE'] + '\n'
  }

  // set CATEGORY-TRANSMITTER
  if(cabrilloObject['CATEGORY-TRANSMITTER']){
    returnString = returnString + 'CATEGORY-TRANSMITTER: ' + cabrilloObject['CATEGORY-TRANSMITTER'] + '\n'
  }

  // set CATEGORY-OVERLAY
  if(cabrilloObject['CATEGORY-OVERLAY']){
    returnString = returnString + 'CATEGORY-OVERLAY: ' + cabrilloObject['CATEGORY-OVERLAY'] + '\n'
  }

  //set CATEGORY-STATION
  if(cabrilloObject['CATEGORY-STATION']){
    returnString = returnString + 'CATEGORY-STATION: ' + cabrilloObject['CATEGORY-STATION'] + '\n'
  }
  // set CLAIMED-SCORE
  if(cabrilloObject['CLAIMED-SCORE']){
    returnString = returnString + 'CLAIMED-SCORE: ' + cabrilloObject['CLAIMED-SCORE'] + '\n'
  }

  // set CLUB
  if(cabrilloObject['CLUB']){
    returnString = returnString + 'CLUB: ' + cabrilloObject['CLUB'] + '\n'
  }

  // set LOCATION
  if(cabrilloObject['LOCATION']){
    returnString = returnString + 'LOCATION: ' + cabrilloObject['LOCATION'] + '\n'
  }

  // set CREATED-BY
  if(cabrilloObject['CREATED-BY']){
    returnString = returnString + 'CREATED-BY: ' + cabrilloObject['CREATED-BY'] + '\n'
  }

  // set NAME
  if(cabrilloObject['NAME']){
    returnString = returnString + 'NAME: ' + cabrilloObject['NAME'] + '\n'
  }

  // when Version is 3 set address
  if(cabrilloVersion!='2.0'){
    // set ADDRESS
    if(cabrilloObject['ADDRESS']){
      returnString = returnString + 'ADDRESS: ' + cabrilloObject['ADDRESS'] + '\n'
    }

    // set ADDRESS-CITY
    if(cabrilloObject['ADDRESS-CITY']){
      returnString = returnString + 'ADDRESS-CITY: ' + cabrilloObject['ADDRESS-CITY'] + '\n'
    }

    // set ADDRESS-STATE-PROVINCE
    if(cabrilloObject['ADDRESS-STATE-PROVINCE']){
      returnString = returnString + 'ADDRESS-STATE-PROVINCE: ' + cabrilloObject['ADDRESS-STATE-PROVINCE'] + '\n'
    }

    // set ADDRESS-POSTALCODE
    if(cabrilloObject['ADDRESS-POSTALCODE']){
      returnString = returnString + 'ADDRESS-POSTALCODE: ' + cabrilloObject['ADDRESS-POSTALCODE'] + '\n'
    }

    // set ADDRESS-COUNTRY
    if(cabrilloObject['ADDRESS-COUNTRY']){
      returnString = returnString + 'ADDRESS-COUNTRY: ' + cabrilloObject['ADDRESS-COUNTRY'] + '\n'
    }
  }else{
    // set ADDRESS 1
    if(cabrilloObject['ADDRESS']){
      returnString = returnString + 'ADDRESS: ' + cabrilloObject['ADDRESS'] + '\n'
    }

    // set ADDRESS 2
    if(cabrilloObject['ADDRESS-CITY']){
      returnString = returnString + 'ADDRESS: ' + cabrilloObject['ADDRESS-CITY'] + ','

      // set ADDRESS-STATE-PROVINCE
      if(cabrilloObject['ADDRESS-STATE-PROVINCE']){
        returnString = returnString + ' ' + cabrilloObject['ADDRESS-STATE-PROVINCE']

        // set ADDRESS-POSTALCODE
        if(cabrilloObject['ADDRESS-POSTALCODE']){
          returnString = returnString + ' ' + cabrilloObject['ADDRESS-POSTALCODE'] + '\n'
        }else{
          returnString = returnString + '\n'
        }
      }else{
        returnString = returnString + '\n'
      }
    }

    // set ADDRESS-COUNTRY
    if(cabrilloObject['ADDRESS-COUNTRY']){
      returnString = returnString + 'ADDRESS: ' + cabrilloObject['ADDRESS-COUNTRY'] + '\n'
    }
  }
  
  // set OPERATORS
  if(cabrilloObject['OPERATORS']){
    returnString = returnString + 'OPERATORS: ' + cabrilloObject['OPERATORS'] + '\n'
  }
  
  // set SOAPBOX
  if(cabrilloObject['SOAPBOX']){
    cabrilloObject['SOAPBOX'].map(function(item){
      returnString = returnString + 'SOAPBOX: ' + item['SOAPBOX'] + '\n'
    })
  }
  
  // set QSO
  if(cabrilloObject['QSO']){
     // Cabrillo default template, and its CQWW, CQWPX series competition
    if(contest == 'default' || contest == 'CQWW' || contest == 'CQWPX'){
      cabrilloObject['QSO'].map(function(item){
        var eachString = 'QSO:'
        var isLicit = true
        // set QSO freq
        if(creatVariableQsoField(item["freq"],5,'right')!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["freq"],5,'right')
        }else{
          isLicit = false
        }
        // set QSO mo
        if(creatUnvariableQsoField(item["mo"],2)!=false){
          eachString = eachString + ' ' + creatUnvariableQsoField(item["mo"],2)
        }else{
          isLicit = false
        }
        // set QSO date
        if(creatUnvariableQsoField(item["date"],10)!=false){
          eachString = eachString + ' ' + creatUnvariableQsoField(item["date"],10)
        }else{
          isLicit = false
        }
        // set QSO time
        if(creatUnvariableQsoField(item["time"],4)!=false){
          eachString = eachString + ' ' + creatUnvariableQsoField(item["time"],4)
        }else{
          isLicit = false
        }
        // set QSO sentcall
        if(creatVariableQsoField(item["sentcall"],13)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["sentcall"],13)
        }else{
          isLicit = false
        }
        // set QSO sentrst
        if(creatVariableQsoField(item["sentrst"],3)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["sentrst"],3)
        }else{
          isLicit = false
        }
        // set QSO sentexch
        if(creatVariableQsoField(item["sentexch"],6)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["sentexch"],6)
        }else{
          isLicit = false
        }
        // set QSO rcvdcall
        if(creatVariableQsoField(item["rcvdcall"],13)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["rcvdcall"],13)
        }else{
          isLicit = false
        }
        // set QSO rcvdrst
        if(creatVariableQsoField(item["rcvdrst"],3)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["rcvdrst"],3)
        }else{
          isLicit = false
        }
        // set QSO sentexch
        if(creatVariableQsoField(item["rcvdexch"],6)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["rcvdexch"],6)
        }else{
          isLicit = false
        }
        // set QSO t
        
        if(creatUnvariableQsoField(item["t"],1)!=false||creatUnvariableQsoField(item["t"],1)==0){
          eachString = eachString + ' ' + item["t"]
        }else{
          isLicit = false
        }

        if(isLicit = false){
          console.warn('Qso record is illegal in' + JSON.stringify(item))
        }else{
          returnString = returnString + eachString + '\n'
        } 
      })
    }
    // NAQP competition format
    if(contest == 'NAQP'){
      cabrilloObject['QSO'].map(function(item){
        var eachString = 'QSO:'
        var isLicit = true
        // set QSO freq
        if(creatVariableQsoField(item["freq"],5,'right')!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["freq"],5,'right')
        }else{
          isLicit = false
        }
        // set QSO mo
        if(creatUnvariableQsoField(item["mo"],2)!=false){
          eachString = eachString + ' ' + creatUnvariableQsoField(item["mo"],2)
        }else{
          isLicit = false
        }
        // set QSO date
        if(creatUnvariableQsoField(item["date"],10)!=false){
          eachString = eachString + ' ' + creatUnvariableQsoField(item["date"],10)
        }else{
          isLicit = false
        }
        // set QSO time
        if(creatUnvariableQsoField(item["time"],4)!=false){
          eachString = eachString + ' ' + creatUnvariableQsoField(item["time"],4)
        }else{
          isLicit = false
        }
        // set QSO sentcall
        if(creatVariableQsoField(item["sentcall"],15)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["sentcall"],15)
        }else{
          isLicit = false
        }
        // set QSO sentname
        if(creatVariableQsoField(item["sentname"],10)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["sentname"],10)
        }else{
          isLicit = false
        }
        // set QSO sentexch
        if(creatVariableQsoField(item["sentexch"],3)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["sentexch"],3)
        }else{
          isLicit = false
        }
        // set QSO rcvdcall
        if(creatVariableQsoField(item["rcvdcall"],15)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["rcvdcall"],15)
        }else{
          isLicit = false
        }
        // set QSO rcvdname
        if(creatVariableQsoField(item["rcvdname"],10)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["rcvdname"],10)
        }else{
          isLicit = false
        }
        // set QSO rcvdexch
        if(creatVariableQsoField(item["rcvdexch"],3)!=false){
          eachString = eachString + ' ' + creatVariableQsoField(item["rcvdexch"],3)
        }else{
          isLicit = false
        }
        if(isLicit = false){
          console.warn('Qso record is illegal in' + JSON.stringify(item))
        }else{
          returnString = returnString + eachString + '\n'
        } 
      })
    }
    //
    // Reserve other contest formats
    // Reserve other contest formats
    //
  }
  
  returnString = returnString + 'END-OF-LOG:'
  return returnString
}

// Exposure module
module.exports.cabrilloToObject = cabrilloToObject;
module.exports.objectToCabrillo = objectToCabrillo;