const {keyMap} = require('./RRMConf/map');
const commonfun = require('./common/commonfun');

const findStructureOfTr069 = (node) =>{
  // Device.xxx.FAPService.{i}.CellConfig.NR.RAN.MeasObjectNR.{i}.CellAdd.{i}.PhysCellId
  // get substring removed the first {i} part
  const keystr = '{i}.'
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

const arrayOfKeyArray = [];
const arrayOfTblObject = [];

Object.keys(keyMap).forEach((objkey)=>{
  // eachTableObj fills in a table
  const eachTableObj = keyMap[objkey];
  // find structure of tr069 node
  const node = eachTableObj[Object.keys(eachTableObj)[0]];
  const keyArray = findStructureOfTr069(node)
  arrayOfKeyArray.push(keyArray)
  arrayOfTblObject.push(eachTableObj)
  // console.log(node);
  // console.log(keyArray);
})

const keyMapObj = {};
// console.log(arrayOfTblObject);
// console.log(arrayOfKeyArray);

// const keykeyMapObj =
// {
//    MeasObjectNR:[
//       {
//           'MeasObjectId': 'Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.MeasObjectId',
//           'ThresholdRSRP': 'Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.ThresholdRSRP',
//           CellAdd:[
//                   {
//                           'PhysCellId': 'Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.CellAdd.{i}.PhysCellId',
//                           'RsrpOffsetSSB': 'Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.CellAdd.{i}.RsrpOffsetSSB',
//                   },
//           ],
//           BlackCell:[
//                   {
//                           'PCIStart': 'Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.BlackCell.{i}.PCIStart',
//                           'PCIRange': 'Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.BlackCell.{i}.PCIRange',
//                   },
//           ],
//       },
//    ],
// }

arrayOfTblObject.forEach((obj, idx)=>{
  // console.log(obj);
  const keyArray = arrayOfKeyArray[idx];
  if(keyArray.length === 1){
    if(keyMapObj[keyArray[0]] === undefined){
      // console.log('test 1');
      keyMapObj[keyArray[0]] = [{
        ...obj
      }]
    }else{
      // console.log('test 1 1');
      const [ existedObj ] = keyMapObj[keyArray[0]];
      keyMapObj[keyArray[0]] = [{
        ...existedObj,
        ...obj
      }]
    }
  }else if(keyArray.length === 2) {
    // console.log('tested 2');
    if(keyMapObj[keyArray[0]] === undefined){
      keyMapObj[keyArray[0]][keyArray[1]]= [{
          ...obj
      }]
    }else{
      // console.log('tested 2');
      const  [ existedObj ]  = keyMapObj[keyArray[0]];
      if(existedObj[keyArray[1]] === undefined){
        keyMapObj[keyArray[0]] = [{
          ...existedObj,
          [ keyArray[1] ]:[{...obj}]
        }]
      }else{
        // console.log('tested branch');
        // keyMapObj[keyArray[0]][keyArray[1]] != undefined
        const [ existedSubObj ] = existedObj[keyArray[1]]
        // console.log('existedSubObj', existedSubObj);
        keyMapObj[keyArray[0]] = [{
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
    if(keyMapObj[keyArray[0]] === undefined){
      console.log('tested 3 0');
      keyMapObj[keyArray[0]] = [{
        [ keyArray[1] ]:tmpObj
      }]
    }else{
      // keyMapObj[keyArray[0]] != undefined
      const  [ existedObj ]  = keyMapObj[keyArray[0]];
      if(existedObj[keyArray[1]] === undefined){
        console.log('test 3 1');
        keyMapObj[keyArray[0]] = [{
          ...existedObj,
          [ keyArray[1] ]:tmpObj
        }]
      }else{
        // keyMapObj[keyArray[0]][keyArray[1]] != undefined
        const [ existedSubObj ] = existedObj[keyArray[1]]
        if(existedSubObj[keyArray[2]] === undefined){
          console.log('not tested');
          existedSubObj[keyArray[2]] = [{
            ...obj
          }]
        }else{
          // keyMapObj[keyArray[0]][keyArray[1]][keyArray[2]] != undefined
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
})

commonfun.objectList2File('keymap.js', ['keykeyMapObj', keyMapObj]);
