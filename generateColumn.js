// exclude rrmobj
// don't have des and node infomation
const fs = require('fs');
const myArgs = process.argv.slice(2);
const filename = myArgs[0]

console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

fs.readFile(filename || './rrmdata.txt', function(err, data) {
  if(err) throw err;
  var array = data.toString().split("\n");
  const moduleName = array[0];
  let treedatabuf = `const ${moduleName}Children = [`
  let importbuf = '';
  let kvbuf = '';
  const jsonLst = []
  for(i in array.slice(1)) {
    const line = array[i].trim();
    if(!line.startsWith('#') && line.length !== 0){
      const lineArray = line.split('\t');
      const { length } = lineArray
      if(length === 4){
        const json = {};
        json['text'] = lineArray[0];
        json['name'] = lineArray[1];
        json['type'] = lineArray[2];
        json['readonly'] = lineArray[3] === 'R';
        jsonLst.push(json)
      }else if(length === 3){
        jsonLst.push(lineArray[1]);
        generatePageFile(moduleName, lineArray)
        const className = lineArray[2];
        const fileName = className.toLowerCase();
        const importStatment = `import ${className} from './component/${moduleName}/${fileName}'\n`
        importbuf += importStatment;
        kvbuf += `'${fileName}': ${className},\n`
        treedatabuf += generateTreeDataFile(moduleName, lineArray)
      }
    }
  }
  objectList2File(moduleName, jsonLst)

  treedatabuf += '\n]\n'
  treedatabuf += `\nexport default ${moduleName}Children`
  // console.log(treedatabuf);
  commonfun.writeFile(`${moduleName}/${moduleName}-tree-data.js`, treedatabuf);
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

function generateTreeDataFile(moduleName, pageInfoArray){
  // {
  //   parentId: 'rrm',
  //   title: '服务小区配置',
  //   key: 'cellconfig'
  // }
  return `
{\n
\tparentId: '${moduleName}',
\ttitle: '${pageInfoArray[0]}',
\tkey: '${pageInfoArray[2].toLowerCase()}',
\n},`
}

// data-field-prop.js
function objectList2File(moduleName, objLst){
  let strbuf='';
  const dataVars = [];
  if(Array.isArray(objLst)){
    objLst.forEach((it)=>{
      if(typeof it  === 'object'){
        const str = object2str(it);
        strbuf += str;
        // console.log(str);
      }else if(typeof it === 'string' && it.length > 0){
       const str = `]\nconst ${it} = [\n`
        dataVars.push(it)
        strbuf += str;
      }
    })
  }

  strbuf += '\n]'
  strbuf = strbuf.substr(1, strbuf.length);
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
    str += `${lessIndent}},`
    // console.log(str);
  }

  return str;
}
