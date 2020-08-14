
const {rrm} = require('./output/rrmobj');
const fs = require('fs');
const myArgs = process.argv.slice(2);
const filename = myArgs[0]

// 4 space
const SP4 = '    '

console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

fs.readFile(filename || './rrmdata.txt', function(err, data) {
  if(err) throw err;
  var array = data.toString().split("\n");
  const moduleName = array[0];
  let treedatabuf = `const ${moduleName}Children = [`
  let importbuf = '';
  let kvbuf = '';
  let leafkey = '';
  let keyName = '';
  const jsonLst = [];
  const keyMapLst = [];
  const mapObj = {};
  let currentmapObjKey = '';
  let treeHierarchyData = '';
  for(i in array.slice(1)) {
    const line = array[i].trim();
    if(!line.startsWith('#') && line.length !== 0){
      if(/(#|[0-9])/.test(line[0])){
        // extract tree hierarchy data
        const lev = parseInt(line[0], 10);

        for(let i = lev-1; i>0; i -=1){
          treeHierarchyData += SP4;
        }
        const la = line.slice(1).split('\t');
        leafkey = la[0];
        treeHierarchyData += leafkey;
        treeHierarchyData += '\n';
        if(la.length > 1){
          jsonLst.push(la[1]);
        }
        continue;
      }
      const lineArray = line.split('\t');
      const { length } = lineArray
      const ancestors = [];
      if(length === 2){
        const json = {};

        // subkey
        const nameCn = `${lineArray[0]}|${lineArray[1]}`;
        json['text'] = lineArray[0];
        // json['name'] = lineArray[1];

        console.log('key, nameCn:', keyName, nameCn);
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
          json['type'] = rrm[keyName][nameCn]['type'];
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
        jsonLst.push(line);
        currentmapObjKey = lineArray[0]
        mapObj[currentmapObjKey] = {};
        console.log('push', lineArray[1]);
        if(length === 4){
          // new page
          if(keyMapLst.length > 0){
            keyMapLst.push(mapObj)
          }
          keyMapLst.push('keyMap')
          keyName = lineArray[0];
          generatePageFile(moduleName, lineArray)
          const className = lineArray[2];
          const fileName = className.toLowerCase();
          const importStatment = `import ${className} from './component/${moduleName}/${fileName}'\n`
          importbuf += importStatment;
          kvbuf += `'${leafkey}': ${className},\n`
        }
      }
    }
  }

  // push the last mapObj
  keyMapLst.push(mapObj)
  console.log(keyMapLst);
  // console.log(jsonLst);
  datafieldprop(moduleName, jsonLst)
  commonfun.objectList2File(`${moduleName}/map.js`, keyMapLst, false);
// objectList2File(moduleName)
  treedatabuf += '\n]\n'
  treedatabuf += `\nexport default ${moduleName}Children`
  // console.log(treedatabuf);
  // commonfun.writeFile(`${moduleName}/${moduleName}-tree-data.js`, treedatabuf);
  commonfun.writeFile('output/treeHierarchyData.txt', treeHierarchyData)
  console.log(importbuf);
  console.log(kvbuf);
});

// index.js
function generatePageFile(moduleName, pageInfoArray) {
  const className = pageInfoArray[2];
  const fileName = className.toLowerCase();
  const filePath = `${moduleName}/${fileName}`

  fs.readFile('./cellpage.tpl', function(err, data){
    if(err) throw err;
    commonfun.writeFile(`${filePath}/index.js`, data.toString().replace('%title%', pageInfoArray[0]).replace(/%classname%/g, className).replace(/%conftype%/g, pageInfoArray[1]))
    // console.log(data.toString().replace('%title%', pageInfoArray[0]).replace(/%classname%/g, pageInfoArray[2]).replace(/%conftype%/g, pageInfoArray[1]));
  })

}

// data-field-prop.js
function datafieldprop(moduleName, objLst){
  let strbuf='';
  const dataVars = [];

  // indicates if a new array variable start
  let newModuleStart = false;

  if(Array.isArray(objLst)){
    objLst.forEach((it, idx)=>{
      if(typeof it  === 'object'){
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
          const la = it.split('\t')
          const title = la[0];
          const name = la[1];
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
  commonfun.writeFile(`${moduleName}/data-field-prop.js`, strbuf)
  // console.log(strbuf);
}

function object2str(obj, indentLevel=2) {
  let indent='';
  for(let i = 0; i < indentLevel; i+=1){
    indent += '\t'
  }
  const lessIndent = indent.substring(0, indent.lastIndexOf('\t'))
  let str = `${lessIndent}{\n`;
  if(obj !== undefined){
    Object.keys(obj).forEach((it)=>{
      if(it === 'readonly')
        str += `${indent}'${it}': ${obj[it]},\n`
      else
        str += `${indent}'${it}': '${obj[it]}',\n`
    })
    str += `${lessIndent}},\n`
    // console.log(str);
  }

  return str;
}

const isString = str=>(typeof(exp) === 'string' || exp instanceof String)

const getStrInParentheses = (str, ch_l, ch_r) =>{
  if(isString(str)){
    return str.substring(str.indexOf(ch_l) + 1, str.indexOf(ch_r))
  }
  return '';
}

function parseTypeValue(typestr, des) {
  if(typestr === 'string'){
    const rangestr = getStrInParentheses(des, '{', '}')
    return ['string', rangestr.split(',')]
  }
  if(typestr === 'boolean'){
    return 'boolean'
  }
  if(typestr.toLowerCase().startsWith('unsignedInt') || typestr.toLowerCase().startsWith('int')){
    const rangestr = typestr.substring(typestr.indexOf('[') + 1, typestr.indexOf(']'))
    if(rangestr){
      if(/[0-9]+:[0-9]+/.test(rangestr)){
        const [l,h] = rangestr.split(':')
        return ['int', [myeval(l), myeval(h)]]
      }
      if(/([0-9]\,)+[0-9]$/.test(rangestr)){
        return ['array', rangestr.split(',')]
      }
    }
  }
}

function myeval(exp) {
  if(isString(exp))
    return eval(exp.replace('^', '**'));
  if(typeof(exp) === 'number'){
    return exp;
  }
  return NaN;
}