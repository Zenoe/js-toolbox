const fs = require('fs');
const myArgs = process.argv.slice(2);
const filename = myArgs[0]

if(filename)
  console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

fs.readFile(filename || './csv/rrm.csv', function(err, data) {
  if(err) throw err;
  var array = data.toString().split("\n");

  let key;
  const paramObj = {};
  array.forEach((it, idx)=>{
    console.log('............', idx);
    const trimline = it.trim();
    if(!trimline.startsWith('#') && trimline.length !== 0){
      const lineArray = trimline.split('\t');
      const { length } = lineArray
      const firstElement = lineArray[0].trim()

      if(!firstElement.startsWith("Device.")){
      // if(length === 7 ){
        // the first column is module'name
        key = lineArray[0].trim()
        console.log('key:', key);
        if(paramObj[key] === undefined)
          paramObj[key] = {};
        const [subkey, subObj] = line2Obj(lineArray.slice(1))
        paramObj[key][subkey] = subObj;
      }else{
        const [subkey, subObj] = line2Obj(lineArray)
        paramObj[key][subkey] = subObj;
      }
    }
  })

  // console.log(paramObj);
  const paramObjLst = ['rrm', paramObj]
  commonfun.objectList2File(`output/rrmobj.js`, paramObjLst, false);
});

function line2Obj(lineArray) {
  if(Array.isArray(lineArray) && lineArray.length >= 5){
    return [lineArray[2], {
      node: lineArray[0].trim(),
      en: lineArray[1].trim(),
      // cn: lineArray[2],
      readonly: lineArray[3] === 'R',
      type: lineArray[4].trim(),
      des: lineArray[5] || '',
    }]
  }
  console.log('error line', lineArray);
  return null;
}
