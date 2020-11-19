/* eslint-disable camelcase */
const { log } = require('console');
const path = require('path')

const commonfun = require('./common/commonfun');
const strUtil = require('./common/stringUtil')


const getPropFiles = (baseDir)=>{
  const propFiles = commonfun.findFilesRecursiveSync(path.resolve(__dirname, baseDir), 'data-field-prop.node')
  console.log(propFiles);
  return propFiles
}



const getDefaultValueByType = (type) => {
  switch (type){
    case 'number':
    case 'int':
      return strUtil.randomInt()
    case 'boolean':
      return strUtil.randomInt() % 2 === 0
    case 'string':
      return strUtil.randomString(8)
  }
  return 0
}


const readProp = (filePath)=>{
  const propData = require(filePath)

  propData.forEach((it,idx)=>{
    if(strUtil.isString(it)){
      console.log(it);
    }else{
      const tr069NodeArr = it
      const tr069kv = tr069NodeArr.map(node=>{
        const icount = (node.node.match(/\{i\}/g) || []).length
        const kvArr = []
        let keystr = node.node
        keystr = keystr.replace('{i}', 1)
        if(icount === 2){
          const keystr_instance1 = keystr.replace('{i}', 1)
          let valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr_instance1}":"${valuestr}"`)

          const keystr_instance2 = keystr.replace('{i}', 2)
          valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr_instance2}":"${valuestr}"`)
        }else if(icount === 3){
          let keystr_instance11 = keystr.replace('{i}', 1)
          keystr_instance11 = keystr_instance11.replace('{i}', 1)
          let valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr_instance11}":"${valuestr}"`)

          let keystr_instance12 = keystr.replace('{i}', 1)
          keystr_instance12 = keystr_instance12.replace('{i}', 2)
          valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr_instance12}":"${valuestr}"`)

          let keystr_instance21 = keystr.replace('{i}', 2)
          keystr_instance21 = keystr_instance11.replace('{i}', 1)
          valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr_instance21}":"${valuestr}"`)

          let keystr_instance22 = keystr.replace('{i}', 2)
          keystr_instance22 = keystr_instance22.replace('{i}', 2)
          valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr_instance22}":"${valuestr}"`)
        }
        else{
          const valuestr = getDefaultValueByType(node.type).toString()
          kvArr.push(`"${keystr}":"${valuestr}"`)
        }

        return kvArr
        // return `${keystr}:"${valuestr}"`
      })
      console.log(commonfun.flatten(tr069kv));
    }
  })
}

const propFiles = getPropFiles('qos')

propFiles.forEach((filePath)=>{
  readProp(filePath)
})
