const {keyMap} = require('./RRMConf/rrmnr/map');
const commonfun = require('./common/commonfun');

const myArgs = process.argv.slice(2);
const moduleName = myArgs[0] || 'RRMConf'

console.log('moduleName:', moduleName);

const findStructureOfTr069 = (node) =>{
  // Device.xxx.FAPService.{i}.CellConfig.NR.RAN.MeasObjectNR.{i}.CellAdd.{i}.PhysCellId
  // get substring removed the first {i} part
  const keystr = '{i}.'
  // console.log(node);
  let partedStr = node.substring(node.indexOf(keystr) + keystr.length)
  const keyArray = [];
  while(partedStr.indexOf(keystr) > 0){
    partedStr = partedStr.substring(partedStr.search(/\w+\.(?=\{i\})/))
    const key = partedStr.substring(0, partedStr.indexOf('.'))
    keyArray.push(key)
    // console.log(key);
    partedStr = partedStr.substring(partedStr.indexOf(keystr) + keystr.length)
  }
  return keyArray
}

function generateMapObj(keyMap, moduleName, page) {
  const keyMapObj = {};

  const arrayOfKeyArray = [];
  const arrayOfTblObject = [];
  const arrOfTblName = [];
  Object.keys(keyMap).forEach((objkey)=>{
    // eachTableObj fills in a table
    const eachTableObj = keyMap[objkey];
    // find structure of tr069 node
    const node = eachTableObj[Object.keys(eachTableObj)[0]];
    const keyArray = findStructureOfTr069(node)
    arrOfTblName.push(objkey)
    arrayOfKeyArray.push(keyArray)
    arrayOfTblObject.push(eachTableObj)
    // console.log(node);
    // console.log(keyArray);
  })

  arrayOfTblObject.forEach((obj, idx)=>{
  // console.log(obj);
  const tblObj = {};
  const keyArray = arrayOfKeyArray[idx];
  const tblName = arrOfTblName[idx];
  if(keyArray.length === 1){
    if(tblObj[keyArray[0]] === undefined){
      // console.log('test 1');
      tblObj[keyArray[0]] = [{
        ...obj
      }]
    }else{
      // console.log('test 1 1');
      const [ existedObj ] = tblObj[keyArray[0]];
      tblObj[keyArray[0]] = [{
        ...existedObj,
        ...obj
      }]
    }
  }else if(keyArray.length === 2) {
    // console.log('tested 2');
    console.log(keyArray);
    if(tblObj[keyArray[0]] === undefined){
      tblObj[keyArray[0]]=[{
        [ keyArray[1 ]]:[{...obj}]
      }]
    }else{
      // console.log('tested 2');
      const  [ existedObj ]  = tblObj[keyArray[0]];
      if(existedObj[keyArray[1]] === undefined){
        tblObj[keyArray[0]] = [{
          ...existedObj,
          [ keyArray[1] ]:[{...obj}]
        }]
      }else{
        // console.log('tested branch');
        // tblObj[keyArray[0]][keyArray[1]] != undefined
        const [ existedSubObj ] = existedObj[keyArray[1]]
        // console.log('existedSubObj', existedSubObj);
        tblObj[keyArray[0]] = [{
          ...existedObj,
          [ keyArray[1] ]:[{
            ...existedSubObj,
            ...obj,
          }]
        }]
      }
    }
  }
  else if(keyArray.length === 3) {
    const tmpObj = [ {[keyArray[2]]:[{...obj}]} ]
    if(tblObj[keyArray[0]] === undefined){
      console.log('tested 3 0');
      tblObj[keyArray[0]] = [{
        [ keyArray[1] ]:tmpObj
      }]
    }else{
      // tblObj[keyArray[0]] != undefined
      const  [ existedObj ]  = tblObj[keyArray[0]];
      if(existedObj[keyArray[1]] === undefined){
        console.log('test 3 1');
        tblObj[keyArray[0]] = [{
          ...existedObj,
          [ keyArray[1] ]:tmpObj
        }]
      }else{
        // tblObj[keyArray[0]][keyArray[1]] != undefined
        const [ existedSubObj ] = existedObj[keyArray[1]]
        if(existedSubObj[keyArray[2]] === undefined){
          console.log('not tested');
          existedSubObj[keyArray[2]] = [{
            ...obj
          }]
        }else{
          // tblObj[keyArray[0]][keyArray[1]][keyArray[2]] != undefined
          console.log('tested branch');
          const [ existSubSubObj ] = existedSubObj[keyArray[2]]
          existedSubObj[keyArray[2]] = [{
            ...existSubSubObj,
            ...obj,
          }]

        }
      }
    }
  }
  keyMapObj[tblName] = tblObj;
})

  commonfun.objectList2File(`${moduleName}/${page}/keymap.js`, ['keyMapObj', keyMapObj]);
}

const pages = commonfun.readSubDirectories(`./${moduleName}`);
console.log(pages);
pages.forEach((page)=>{
  const {keyMap} = require(`./${moduleName}/${page}/map`);
  generateMapObj(keyMap, moduleName, page)
})
// generateMapObj(keyMap)
