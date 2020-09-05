/**
    Question 6:
    AllKeys: 0-9;
    usedKeys: an array to store all used keys like [2,3,4];
    We want to get an array which contains all the unused keys,
    in this example it would be: [0,1,5,6,7,8,9]
**/

const {assert} = require('./helper');

// not support keys of Object type
function getUnUsedKeys(allKeys, usedKeys) {
  assert((Array.isArray(allKeys) && Array.isArray(usedKeys)), 'only accept array parameter')
  return allKeys.filter((it)=>(!usedKeys.includes(it)))
}

module.exports = {
  getUnUsedKeys
}
