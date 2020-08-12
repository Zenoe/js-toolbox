
const fs = require('fs');
const myArgs = process.argv.slice(2);
const filename = myArgs[0]

const ColumnEnum = Object.freeze({'param_data_model':1,
                                  'param_name_en':2,
                                  'param_name_cn':3,
                                  'read_write_permission':4,
                                  'param_type': 5,
                                  'param_belong_table': 6,
                                  'param_standard_name': 7,})

if(filename)
  console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

fs.readFile(filename || './csv/param.csv', function(err, data) {
  if(err) throw err;
  var array = data.toString().split("\n");

  const paramObjLst = [];
  const paramObj = {};
  array.forEach((it, idx)=>{
    const trimline = it.trim();
    if(!trimline.startsWith('#') && trimline.length !== 0){
      const lineArray = trimline.split('\t');
      const { length } = lineArray
      if(length !== 8 ){
        // console.log('push------', lineArray[0], idx);
        paramObjLst.push(lineArray[0])
        return;
      }
      // const key = `${lineArray[ColumnEnum.param_belong_table]}|${lineArray[ColumnEnum.param_standard_name]}`
      const key = `${lineArray[ColumnEnum.param_belong_table]}`
      const subkey = `${lineArray[ColumnEnum.param_standard_name]}`

      if(paramObj[key] === undefined){
        paramObj[key] = {}
      }
     
      const moduleObj = {};
      moduleObj.node = lineArray[ColumnEnum.param_data_model]
      moduleObj.en = lineArray[ColumnEnum.param_name_en]
      moduleObj.cn = lineArray[ColumnEnum.param_name_cn]
      moduleObj.rw = lineArray[ColumnEnum.read_write_permission]
      moduleObj.type = lineArray[ColumnEnum.param_type]
      const nodeObj = {};
      nodeObj[subkey] = moduleObj;
      // console.log('............', nodeObj);
      // paramObj[key].push(nodeObj);
      paramObj[key][subkey] = moduleObj;
      // paramObj[key] = moduleObj;
    }
  })

  paramObjLst.push(paramObj)
  // console.log(paramObj);
  commonfun.objectList2File(`paramcsv.js`, paramObjLst);
});
