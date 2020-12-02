const fs = require('fs');
const myArgs = process.argv.slice(2);
const filename = myArgs[0]

const indentSpc = 4;

console.log('read file: ', filename);

const commonfun = require('./common/commonfun');

fs.readFile(filename, function(err, data) {
  if(err) throw err;
  var array = data.toString().split("\n");
  let p1, p11, p111
  let moduleName
  const treeDataArray = [];

  array.forEach((line)=>{
    if(/^\s*$/.test(line) || line.startsWith('#')){
      return;
    }
    if(!moduleName){
      moduleName = line
      return
    }
    if(treeDataArray.length === 0)
      treeDataArray.push(`${moduleName}Children`)

    const level = commonfun.countLeadingSpc(line)/indentSpc;
    if(level === 0){
      p1 = {title: line, key: line, parentId: moduleName, children: []}
      p11 = undefined;
      p111 = undefined;
      treeDataArray.push(p1)
    }else if(level === 1){
      p11 = {title: line.trim(), key: line.trim(), children: []}
      p1.children.push(p11)
    }else if(level ===2){
      p111 = {title: line.trim(),key: line.trim(), children: []}
      p11.children.push(p111)
    }
  })

  // commonfun.objectList2File(`output/treedata/${moduleName}-tree-data.js`, treeDataArray)
  commonfun.objectList2File(`${moduleName}/${moduleName}-tree-data.js`, treeDataArray)
});
