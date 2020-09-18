
const {rrm} = require('./output/rrmobj');
const fs = require('fs');

const myArgs = process.argv.slice(2);
const filename = myArgs[0]

// 4 space
const SP4 = '    '

console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

let currentClassName = '';

fs.readFile(filename || './rrmdata.txt', function(err, data) {
  if(err) throw err;
  const array = data.toString().split("\n");
  const moduleName = array[0];
  let treedatabuf = `const ${moduleName}Children = [`
  let importbuf = '';
  let kvbuf = '';
  let leafkey = '';
  let keyName = '';
  let jsonLst = [];
  const keyMapLst = [];
  keyMapLst.push('keyMap')
  let mapObj = {};
  let currentmapObjKey = '';
  let treeHierarchyData = '';
  array.slice(1).forEach(rawline=>{
    const line = rawline.trim();
    if(!line.startsWith('#') && line.length !== 0){
      if(/(#|[0-9])/.test(line[0])){
        // extract tree hierarchy data

        if(jsonLst.length > 0){
          datafieldprop(moduleName, jsonLst)
          jsonLst = []
        }

        const lev = parseInt(line[0], 10);

        for(let k = lev-1; k>0; k -=1){
          treeHierarchyData += SP4;
        }
        const la = line.slice(1).split('\t');
        [ leafkey ] = la;
        treeHierarchyData += leafkey;
        treeHierarchyData += '\n';
        if(la.length > 1){
          jsonLst.push(la[1]);
        }
        return;
      }
      const lineArray = line.split('\t');
      const { length } = lineArray
      if(length === 2){
        const json = {};

        // subkey
        const nameCn = `${lineArray[0]}|${lineArray[1]}`;
        json['text'] = lineArray[0];
        // json['name'] = lineArray[1];

        // console.log('key, nameCn:', keyName, nameCn);
        const nodeInfo = rrm[keyName][nameCn];
        // console.log('--------------', rrm[keyName][nameCn]);
        if(nodeInfo){
          json['readonly'] = rrm[keyName][nameCn]['readonly'];
          const nameEn = rrm[keyName][nameCn]['en'];
          const dotPos = nameEn.lastIndexOf('.');
          if(dotPos > 0)
            json['name'] = nameEn.substring(dotPos + 1);
          else
            json['name'] = nameEn;

          // console.log(parseTypeValue(rrm[keyName][nameCn]['type']));
          let fieldType, fieldRule
          try{
            [fieldType, fieldRule] = parseTypeValue(rrm[keyName][nameCn]['type'], rrm[keyName][nameCn]['des'])
          }catch(ex){
            console.log('parseTypeValue error');
            console.log(parseTypeValue(rrm[keyName][nameCn]['type']));
          }
          json['type'] = fieldType;
          if(fieldRule !== undefined){
            if(fieldType === 'array'){
              json['range'] = fieldRule
            }else if(fieldType === 'string'){
              let rangestr = "["
              fieldRule.forEach((it)=>{
                rangestr += `'${it}',`
              })
              rangestr += "]"
              // json['rule'] = fieldRule;
              json['range'] = rangestr;
            }
          }
          json['node'] = rrm[keyName][nameCn]['node']
          json['des'] = rrm[keyName][nameCn]['des']

          // generate mapobj
          const node = rrm[keyName][nameCn]['node'];
          const dataFieldKey = node.substring(node.lastIndexOf('.') + 1);
          mapObj[currentmapObjKey][dataFieldKey] = node;
          jsonLst.push(json)

        }else{
          // {i}
          json['name'] = lineArray[1];
          json['readonly'] = true;
          json['type'] = 'int';
        }
      }else if(length === 3 || length === 4){
        // jsonLst.push(lineArray[1]);
        // write map.js for last section

        if(length ===4 && currentClassName.length > 0){
          generateMapFile(moduleName, currentClassName, mapObj)
          mapObj = {};
          // const filePath = `${moduleName}/${currentClassName.toLowerCase()}`
          // commonfun.objectList2File(`${filePath}/map.js`, [currentClassName, mapObj], false);
          // mapObj = {}
        }

        jsonLst.push(line);
        currentmapObjKey = lineArray[0]
        mapObj[currentmapObjKey] = {};
        console.log('push', lineArray[1]);
        if(length === 4){
          // new page
          if(keyMapLst.length > 0){
            keyMapLst.push(mapObj)
          }
          keyName = lineArray[0];
          generatePageFile(moduleName, lineArray )
          const className = lineArray[2];
          const fileName = className.toLowerCase();
          const importStatment = `import ${className} from './component/${moduleName}/${fileName}'\n`
          importbuf += importStatment;
          kvbuf += `'${leafkey}': ${className},\n`
        }
      }
    }
  })
  for(const i in array.slice(1)) {

  }

  // push the last mapObj
  keyMapLst.push(mapObj)
  generateMapFile(moduleName, currentClassName, mapObj)

  // console.log(keyMapLst);
  // console.log(jsonLst);
  datafieldprop(moduleName, jsonLst)
  // commonfun.objectList2File(`${moduleName}/map.js`, keyMapLst, false);
  treedatabuf += '\n]\n'
  treedatabuf += `\nexport default ${moduleName}Children`
  // console.log(treedatabuf);
  commonfun.writeFile(`${moduleName}/${moduleName}-tree-data.js`, treedatabuf);
  commonfun.writeFile('output/treeHierarchyData.txt', treeHierarchyData)
  console.log(importbuf);
  console.log(kvbuf);
});

function generateMapFile(moduleName, className, mapObj) {
  const filePath = `${moduleName}/${className.toLowerCase()}`
  commonfun.objectList2File(`${filePath}/map.js`, ['keyMap', mapObj], false);
}

// index.js
// lineArray: NR测量对象设置	rrmFapserviceMeasObjectNrCellAdd	RRMNr	tr069key(form)
function generatePageFile(moduleName, pageInfoArray ) {
  const className = pageInfoArray[2];
  currentClassName = className;
  console.log('-----------', currentClassName);
  const fileName = className.toLowerCase();
  const filePath = `${moduleName}/${fileName}`

  let template = './cellpage.tpl';
  if(pageInfoArray[3].includes('form')){
   template = './cellpageform.tpl' ;
  }

  fs.readFile(template, function(err, data){
    if(err) throw err;
    commonfun.writeFile(`${filePath}/index.js`, data.toString().replace('%title%', pageInfoArray[0]).replace(/%classname%/g, className).replace(/%conftype%/g, pageInfoArray[1]))
    // console.log(data.toString().replace('%title%', pageInfoArray[0]).replace(/%classname%/g, pageInfoArray[2]).replace(/%conftype%/g, pageInfoArray[1]));
  })

}

function addIProperty(obj){
  const retObj = [];
  // if(objLst.length > 0)
    // Device.X_WWW-RUIJIE-COM-CN.Services.FAPService.{i}.CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.CellAdd.{i}.PhysCellId
    // const node = objLst[2].node;
    const node = obj.node;
    let dataName = node.substring(node.indexOf('FAPService.{i}.') + 'FAPService.{i}.'.length)

  // if(dataName.indexOf('.{i}') < 0){
  //   return objLst
  // }

  const keyIPos = dataName.search(/\w+\.(?=\{i}+)/);
  if(keyIPos === -1){
    // no {i} left after FAPService.{i}  being removed
    // .CellConfig.NR.RAN.LB.PRBUtilizationAlgorithm.ExecuteThresholdUL
    // ==> ExecuteThresholdUL
    dataName = dataName.substring(dataName.lastIndexOf('.') + 1)
  }
  else{
    // CellConfig.NR.RAN.Mobility.ConnMode.NR.MeasObjectNR.{i}.CellAdd.{i}.PhysCellId
    // MeasObjectNR.{i}.CellAdd.{i}.PhysCellId
    dataName = dataName.substring(dataName.search(/\w+\.(?=\{i})/));
  }

  dataName = dataName.substring(0, dataName.lastIndexOf('.'))
  const instanceProp = dataName.split('.{i}')
  // ["MeasObjectNR", ".CellAdd", ""]
  instanceProp.forEach((it)=>{
    let prop = it;
    if(it.startsWith('.')){
      prop = it.substring(1);
    }
    if(prop.length > 0){
      retObj.push({
        'text': prop,
        'readonly': true,
        'name': prop,
        'type': 'number',
        'node': node,
        'des': '',
      })
    }
  })
  // retObj.push(...objLst)
  // console.log(retObj);
  return retObj
}
/*
  data-field-prop.js
  'modulerrmFapserviceMeasObjectNrCellAdd',
  'NR测量对象设置\trrmFapserviceMeasObjectNrCellAdd\tRRMNr\tkey',
  Object,
  Object,
  'SSB测量\tssbMeasure\tssbMeasure',
  Object,
  Object,
  Object,
 */
function datafieldprop(moduleName, objLst){
  debugger
  let strbuf='';
  let filePath = '';
  const dataVars = [];

  // indicates if a new array variable start
  let newModuleStart = false;
  let newSectionStart = false;

  if(Array.isArray(objLst)){
    objLst.forEach((it, idx)=>{
      if(typeof it  === 'object'){
        if(newSectionStart){
          const propObjArray = addIProperty(it);
          propObjArray.forEach((propObj)=>{
            const str = object2str(propObj, 3);
            strbuf += str;
          })
          newSectionStart = false
        }
        const str = object2str(it, 3);
        strbuf += str;
        // console.log(str);
      }else if(typeof it === 'string' && it.length > 0){
        if(it.startsWith('module')){
          newModuleStart = true;
          const moduleName = it.slice('module'.length)
          const str = idx === 0 ? `const ${moduleName} = [\n` : `\n\t]\n]\nconst ${moduleName} = [\n`
          dataVars.push(moduleName)
          strbuf += str;
        }else{
          newSectionStart = true
          const la = it.split('\t')
          if(la.length === 4){
            const className = la[2];
            filePath = `${moduleName}/${className.toLowerCase()}`
          }
          const title = la[0];
          const titleStatement = `\t'${title}',`;

          const str = newModuleStart ? `${titleStatement}\n\t[\n` : `\t],\n${titleStatement}\n\t[\n`
          strbuf += str;
          newModuleStart = false;
        }
      }
    })
  }

  strbuf += '\t]\n]'
  // strbuf = strbuf.substr(1, strbuf.length);
  strbuf += `\nexport {${dataVars.toString()}}`
  const importStatement = "import {  minMaxValiator } from '@/utils/validator'\n\n"

  commonfun.writeFile(`${filePath}/data-field-prop.js`, importStatement)
  commonfun.appendFile(`${filePath}/data-field-prop.js`, strbuf)
  // console.log(strbuf);
}

function object2str(obj, indentLevel=2) {
  let indent='';
  const notStringValueAttributes=['rule', 'readonly', 'range']

  for(let i = 0; i < indentLevel; i+=1){
    indent += '\t'
  }
  const lessIndent = indent.substring(0, indent.lastIndexOf('\t'))
  let str = `${lessIndent}{\n`;
  if(obj !== undefined){
    Object.keys(obj).forEach((it)=>{
      if(notStringValueAttributes.includes(it))
        str += `${indent}'${it}': ${obj[it]},\n`
      else
        str += `${indent}'${it}': '${obj[it]}',\n`
    })
    str += `${lessIndent}},\n`
    // console.log(str);
  }

  return str;
}


const getStrInParentheses = (str, ch_l, ch_r) =>{
  if(commonfun.isString(str)){
    return str.substring(str.indexOf(ch_l) + 1, str.indexOf(ch_r))
  }
  return '';
}

function parseTypeValue(typestr, des) {
  console.log('parseTypeValue', typestr, des);
  if(typestr.toLowerCase().startsWith('string')){
    const rangestr = getStrInParentheses(des, '{', '}')
    const rangeArray = []

    rangestr.split(',').forEach((it)=>{
      rangeArray.push(`${it}`)
    })
    return ['string', rangeArray]
  }
  if(typestr.startsWith('bool')){
    return ['boolean']
  }
  if(typestr.toLowerCase().startsWith('unsignedint') || typestr.toLowerCase().startsWith('int')){
    const rangestr = typestr.substring(typestr.indexOf('[') + 1, typestr.indexOf(']'))
    if(rangestr){
      if(/[0-9]+:[0-9]+/.test(rangestr)){
        const [l,h] = rangestr.split(':')
        // return ['int', [myeval(l), myeval(h)]]
        return ['number', `minMaxValiator(${myeval(l)}, ${myeval(h)})`]
        // return ['number', validator]
      }
      // 5,10,20,40,180
      if(/([0-9]+,)+[0-9]+$/.test(rangestr)){
        // return 'array', range
        return ['array', `[ ${rangestr.split(',')}]`]
      }
    }else{
      return ['number']
    }
  }
  // special cases
  if(typestr === '80bits'){
    return ['string']
  }
}

function myeval(exp) {
  if(commonfun.isString(exp))
    return eval(exp.replace('^', '**'));
  if(typeof(exp) === 'number'){
    return exp;
  }
  return NaN;
}

const testRegexs = (arrRegex, str) =>{
  return arrRegex.some(regex=>(new RegExp(regex).test(str)))
}

const extractRegex = nodes =>{
  const commonPrefixObj = {};
  nodes.forEach(node=>{

    const lastSection = node.substring(node.lastIndexOf('.') + 1)
    const prefix = node.substring(0, node.lastIndexOf('.'))

    if(commonPrefixObj[prefix] === undefined){
      commonPrefixObj[prefix] = [];
    }

    commonPrefixObj[prefix].push(lastSection)
  })

  const arrRegex = [];
  Object.keys(commonPrefixObj).forEach((prefix)=>{
    const regexCombineLastSections = `${prefix}.(${commonPrefixObj[prefix].join('|')})`
    arrRegex.push(regexCombineLastSections.replace(/\./g, '\\.').replace(/{i}/g,'\\d+'))
  })
  return arrRegex;
}
