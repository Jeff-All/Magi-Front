
import xlsx from 'xlsx'

export default function processFile(callback, batch, file) {
  console.log("process")
  if(!file) {
    console.log("file is null")
    return
  }
  var reader = new FileReader();
  reader.onload = event => {
      processWorkbook(
        callback,
        batch,
        xlsx.read(event.target.result, {type: 'binary'}),
      );
  }
  reader.readAsBinaryString(file)
}

function processWorkbook(callback, batch, workbook) {
  workbook.SheetNames.forEach(element => {
    processWorksheet(
      callback,
      batch,
      workbook.Sheets[element],
      element,
    );
  });
}

async function processWorksheet(callback, batch, worksheet, sheetName) {
  let headerMap = getHeaderMap(worksheet);
  let toReturn = [];
  for(let row=2; worksheet[headerMap.family_id+row]; row++) {
    toReturn.push(processRow(
      headerMap, batch, sheetName, worksheet, row,
    ))
  }
  callback(toReturn);
}

function getHeaderMap(worksheet) {
  let map = {};
  var i = 0;
  do {
    let colChar =  xlsx.utils.encode_col(i);
    console.log("colChar",colChar)
    var cur = worksheet[colChar+"1"];
    if(cur) {
        map[cur.v.toLowerCase()] = colChar;
    }
    i++;
  } while(cur)
  console.log("map", map)
  return map
}

function processRow(headerMap, batch, sheetName, worksheet, row) {
  console.log("processRow", sheetName, row);
  var jsonObj = {
      row: row,
      sheet: sheetName,
      batch: batch,

      FamilyID:   getValue(worksheet[headerMap["family_id"] + row]),
      Response:   getValue(worksheet[headerMap["response"] + row]),
      FamilyName: getValue(worksheet[headerMap["familyname"] + row]),
      AdultChild: getValue(worksheet[headerMap["adult/child"] + row]),
      FirstName:  getValue(worksheet[headerMap["first_name"] + row]),
      Program:    getValue(worksheet[headerMap["program"] + row]),
      Age:        parseInt(getValue(worksheet[headerMap["age"] + row])),
      Gender:     getValue(worksheet[headerMap["gender"] + row]),
      
      gifts:[{
          Category:   getValue(worksheet[headerMap["gift1_category"] + row]),
          Name:       getValue(worksheet[headerMap["gift1"] + row]),
          Detail:     getValue(worksheet[headerMap["gift1_detail"] + row]) 
            ? getValue(worksheet[headerMap["gift1_detail"] + row]) 
            : undefined,
      }],
  };
  if(worksheet[headerMap["gift2"] + row]) {
      jsonObj.gifts.push({
          Category:   getValue(worksheet[headerMap["gift2_category"] + row]),
          Name:       getValue(worksheet[headerMap["gift2"] + row]),
          Detail:     getValue(worksheet[headerMap["gift2_detail"] + row]), 
      });
  }
  return jsonObj;
}

function getValue(val) {
  if(val) { return String(val.v).toLowerCase(); }
}