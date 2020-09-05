/**
  Question 2: sort extensions by extType follow these orders ASC
  DigitalUser < VitrualUser < FaxUser < AO < Dept.
**/

const {assert} = require('./helper');

function sortExtensionsByExtType(extensions) {
  const createPropWeightObj = (propArray)=>{
    assert(Array.isArray(propArray))
    const weightObj = {}
    propArray.forEach((it, idx)=>{
      // the weight increases along with the idx value
      weightObj[it] = idx + 1
    })
    return weightObj
  }

  const stringOrderArray = ['DigitalUser', 'VirtualUser', 'FaxUser', 'AO', 'Dept'];

  const weightObj = createPropWeightObj(stringOrderArray)
  // weightObj might looks like this
  // {
  //   DigitalUser: 1,
  //   VirtualUser: 2,
  //   FaxUser: 3,
  //   AO: 4,
  //   Dept: 5,
  // }

  const compare = (x, y)=>{

    // in case of undefined value
    const wx = weightObj[x.ext] || 0
    const wy = weightObj[y.ext] || 0

    return wx-wy;
  }
  if(extensions.length <= 1){
    return extensions
  }
  return extensions.sort(compare)
}
module.exports = sortExtensionsByExtType;
