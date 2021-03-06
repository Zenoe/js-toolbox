const path = require('path')
const fs = require('fs');
// const mkdirp = require('mkdirp');

// function flatten(arr) {
//   return arr.reduce(function (flat, toFlatten) {
//     return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
//   }, []);
// }
const flatten = (arr) =>  arr.reduce((flat, next) => flat.concat(next), []);
const findFilesRecursiveSync = (startPath, includeStr='', excludeDir=[]) => {
  const result = [];
  const files = fs.readdirSync(startPath);

  files.forEach(val => {
    const file = path.join(startPath, val);
    const stats = fs.statSync(file);

    if(stats.isDirectory() && !excludeDir.includes(val)) {
      result.push(...findFilesRecursiveSync(file, includeStr, excludeDir));
    } else if(stats.isFile()) {
      if(includeStr.length > 0){
        if(val.includes(includeStr)){
          result.push(file);
        }
      }else{
        result.push(file);
      }
    }
  });

  return result;
}

const writeFile = (filePath, content) => {
  const thispath = filePath.substring(0, filePath.lastIndexOf('\/'));
  // console.log('mkdir: ', thispath);
  if (thispath.length > 0 && ! fs.existsSync(thispath)) {
    try{
      fs.mkdirSync(thispath, { recursive: true })
    }catch(e){
      console.log('mkdirSync failed: ', e);
    }
  }
  fs.writeFileSync(filePath, content, function (err) {
    if (err) return console.log('writeFile failed:', err);
    console.log('saved: ', filePath);
  });
  console.log('write to file:', filePath);
  // mkdirp(filePath.substring(0, filePath.lastIndexOf('\/'))).then(()=>{
  //   fs.writeFile(filePath, content, function (err) {
  //     if (err) return console.log('writeFile failed:', err);
  //     console.log('saved: ', filePath);
  //   });
  // })
}

module.exports = {
  flatten,
  findFilesRecursiveSync,
  writeFile,

  appendFile: function(filePath, content){
    fs.appendFileSync(filePath, content, function (err) {
      if (err) return console.log('append failed: ', err);
      console.log('appended: ', filePath);
    });
  },

  /*
   * get a list of directories in certain dir
   */
  readSubDirectories :function(dir) {
    const { readdirSync } = require('fs')
      return readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  },

  isString: function(exp){return typeof(exp) === 'string' || exp instanceof String},

  randomIntDataSet: function(dataSetSize, minValue, maxValue) {
    return new Array(dataSetSize).fill(0).map(function(n) {
      return Math.floor(Math.random() * (maxValue - minValue) + minValue);
    });
  },

  /* exclude type of array */
  isJustAObj: function(obj){
    return !!obj && obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]'
  },

  countLeadingSpc : function (str){
    return /^ .*/.test(str) ? str.search(/\S/) : 0
  },

  /*
   * objLst: [objectName1, objectValue1, objectName2, objectValue2, ...]
   */
  objectList2File: function(filepath, objLst, es6=true, debug=false){
    const  object2str = (obj, indentLevel=2) => {
      let indent='';
      for(let i = 0; i < indentLevel; i+=1){
        indent += '\t'
      }
      const lessIndent = indent.substring(0, indent.lastIndexOf('\t'))
      let str='';
      if(obj !== undefined){
        if(Array.isArray(obj)){
          str += `${lessIndent}[\n`
          obj.forEach((subobj)=>{
            str += object2str(subobj, indentLevel + 1)
          })
          str += `${lessIndent}],\n`
        }
        else if(this.isJustAObj(obj)){
          str += `${lessIndent}{\n`
          Object.keys(obj).forEach((it)=>{
            if(this.isJustAObj(obj[it])){
              str += `${indent}'${it}':\n${object2str(obj[it], indentLevel+1)}`
            }else if(Array.isArray(obj[it])){
              str += `${indent}${it}:\n`
              str += object2str(obj[it], indentLevel + 1)
            }
            else{
              if(it === 'someAttribute') // some attributes, the values of which neednt be quoted
                str += `${indent}'${it}': ${obj[it]},\n`
              else
                str += `${indent}'${it}': '${obj[it]}',\n`
            }
          })
          str += `${lessIndent}},\n`
        }else{
          // obj is a string
          str += `${lessIndent}'${obj}',\n`
        }
      }
      return str;
    }

    let strbuf='';
    const dataVars = [];
    if(Array.isArray(objLst)){
      // objLst: objName, objValue, objName, objValue,...
      objLst.forEach((it, idx)=>{
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

    strbuf = strbuf.substr(1, strbuf.length);

    if(objLst.length === 2){
      // only one object in list
      console.log('remove brackets');
      // strbuf = strbuf.replace(/\[|\]/, '')
      // remove first [
      strbuf = strbuf.replace(/\[/, '')
      // remove last , and \n
      strbuf = strbuf.substr(0, strbuf.length-2);
    }
    else{
      strbuf += '\n]'
    }
    if(es6){

      strbuf += `\n\nexport {${dataVars.toString()}}`
    }
    else{
      strbuf += '\nmodule.exports = {\n';
      strbuf += `\t${dataVars.toString()}\n}`
    }

    if(debug){
      console.log(strbuf);
    }
    else{
      // this.writeFile(filepath, `// ${this.getTimeStamp()}\n\n`)
      // this.appendFile(filepath, strbuf)
      this.writeFile(filepath, strbuf)
    }
  }
}


// const lineReader = require('line-reader');

// lineReader.eachLine('./rrmdata.txt', function(line) {
//     console.log(line);
// });
