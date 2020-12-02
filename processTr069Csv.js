const fs = require('fs');
const myArgs = process.argv.slice(2);
const filename = myArgs[0]

if(filename)
  console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

fs.readFile(filename , function(err, data) {
  if(err) throw err;
  var array = data.toString().split("\n");

  const moduleName = filename.substring(0, filename.lastIndexOf('.'))
  let key;
  const paramObj = {};
  array.forEach((it, idx)=>{
    const trimline = it.trim();
    if(!trimline.startsWith('#') && trimline.length !== 0){
      const lineArray = trimline.split('\t');
      const { length } = lineArray
      const firstElement = lineArray[0].trim()

      if(!firstElement.startsWith("Device.")){
        // Lines start with say 'NR测量对象设置' that is the key
        // the first column is module'name
      // if(length === 7 ){
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
  commonfun.objectList2File(`output/${moduleName}-rrmobj.js`, paramObjLst, false);
});

function line2Obj(lineArray) {
  if(Array.isArray(lineArray) && lineArray.length >= 5){
    const en = lineArray[1].trim();
    return [`${lineArray[2]}|${en}`, {
      node: lineArray[0].trim(),
      en,
      // cn: lineArray[2],
      readonly: lineArray[3] === 'R',
      type: lineArray[4].trim(),
      des: lineArray[5] || '',
      dataRange: lineArray[6] || '',
    }]
  }
  console.log('error line', lineArray, lineArray.length);
  return null;
}
