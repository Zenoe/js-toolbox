/* eslint-disable camelcase */

const commonfun = require('./commonfun');

const getStrInParentheses = (str, pch_l, pch_r) =>{
  let ch_l = pch_l
  let ch_r = pch_r
  if(ch_l === undefined){
    ch_l = '('
    ch_r = ')'
    if(str.indexOf(ch_l) < 0){
      ch_l = '{'
      ch_r = '}'
      if(str.indexOf(ch_l) < 0){
        ch_l = '['
        ch_r = ']'
      }
    }
  }
  if(commonfun.isString(str)){
    return str.substring(str.indexOf(ch_l) + 1, str.indexOf(ch_r))
  }
  return '';
}

function myeval(exp) {
  if(commonfun.isString(exp))
    return eval(exp.replace('^', '**'));
  if(typeof(exp) === 'number'){
    return exp;
  }
  return NaN;
}

function parseStringType(strType){
  if(strType === 'ip'){
    return 'ipValidator()'
  }
  if(strType === 'url'){
    return 'urlValidator'
  }
  return null
}

/*
 * dataRange : (x,y)
 */
function parseDataRange(dataRange){
  let rangestr = getStrInParentheses(dataRange)
  if(rangestr.length === 0){
    rangestr = dataRange
  }
  console.log('number-------', rangestr, dataRange);
  const [min, max] = rangestr.split(',')
  if(min !== undefined && max !== undefined)
    return ['number', `minMaxValiator(${min}, ${max})`]
  return ['number']
}

/*
 * return:
 * array, range
 * string, validator
 * number, validator
 * boolean
 */
function parseTypeValue(typestr, dataRange) {
  console.log('parseTypeValue', typestr, dataRange);
  if(typestr.toLowerCase().startsWith('string')){
    const parseDataRangeResult = parseStringType(dataRange)
    if(parseDataRangeResult){
      return ['string', parseDataRangeResult]
    }
    // string(2,16)  2-16
    // string(16) 0-16
    const strSize = getStrInParentheses(typestr)
    if(strSize.indexOf(',') > 0){
      const [min, max] = strSize.split(',')
      return ['string', `stringSizeValidator(${parseInt(min, 10)}, ${parseInt(max, 10)})`]
    }else if(parseInt(strSize,10)){
      // string(strSize)
      return ['string', `stringSizeValidator(0, ${parseInt(strSize, 10)})`]
    }else{
      // string
      return ['string']
    }
  }
  if(typestr === 'array'){
    let rangeArrayStr = '['

    let rangestr = getStrInParentheses(dataRange)
    if(rangestr.length === 0){
      rangestr = dataRange
    }
    rangestr.split(',').forEach((it)=>{
      rangeArrayStr = `${rangeArrayStr}"${it}" ,`
    })

    console.log('rangestr.......', rangeArrayStr);
    rangeArrayStr=`${rangeArrayStr}]`
    return ['array', rangeArrayStr]
  }

  if(typestr.startsWith('bool')){
    return ['boolean']
  }

  if(typestr.toLowerCase().includes('int')){
    const rangestr = typestr.substring(typestr.indexOf('[') + 1, typestr.indexOf(']'))
    if(rangestr){
      if(/[0-9]+:[0-9]+/.test(rangestr)){
        const hlArr = rangestr.split(':')
        if(hlArr.length === 2){
          const [l,h] = hlArr
          // return ['int', [myeval(l), myeval(h)]]
          return ['number', `minMaxValiator(${myeval(l)}, ${myeval(h)})`]
          // return ['number', validator]
        }else{
          parseDataRange(dataRange)
        }
      }
      // 5,10,20,40,180
      if(/([0-9]+,)+[0-9]+$/.test(rangestr)){
        // return 'array', range
        return ['array', `[ ${rangestr.split(',')}]`]
      }
    }else{
      return parseDataRange(dataRange)
    }
  }
  // special cases
  if(typestr === '80bits'){
    return ['string']
  }
  return []
}

module.exports=parseTypeValue
