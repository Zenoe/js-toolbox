/**
  extensions is an Array and each item has such format:
  {firstName: 'xxx', lastName: 'xxx', ext: 'xxx', extType: 'xxx'}
  lastName, ext can be empty, extType can only has "DigitalUser", "VirtualUser","FaxUser","Dept","AO".
**/

/**
  Question 1: sort extensions by "firstName" + "lastName" + "ext" ASC

**/

const {assert, isJustAObj} = require('./helper');

const objCompare = (propArray) => {
  return (obj1, obj2)=>{
    if(propArray.length === 1){
      const p1 =obj1[propArray[0]].toString()
      const p2 =obj2[propArray[0]].toString()
      return p1.localeCompare(p2)
    }
    const p1 = obj1[propArray[0]]
    const p2 = obj2[propArray[0]]
    if(p1 === undefined){
      if(p2 === undefined){
        return objCompare(propArray.slice(1))(obj1, obj2)
      }
      // p1 is undefined and p2 is normal value
      // make undefined value be in front of normal value
      return -1
    }else{
      if(p2 === undefined){
        // p1 is normal value and p2 is undefined
        return 1
      }
    }
    // both p1 and p2 are normal values
    if(p1 === p2){
      return objCompare(propArray.slice(1))(obj1, obj2)
    }
    if(p1 < p2){
      return -1
    }
    if(p1 > p2){
      return 1
    }
  }
}

function sortExtensionsByName(extensions) {
  assert(Array.isArray(extensions), 'only accept array parameter')
  if(extensions.length <= 1){
    return extensions;
  }
  // first compared by firstName, then lastName and then ext
  const comparePorps = ['firstName', 'lastName', 'ext']

  // get compare function according to property's order
  const compareFun=objCompare(comparePorps)

  return extensions.sort(compareFun)
}

module.exports = sortExtensionsByName
