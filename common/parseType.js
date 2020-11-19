const commonfun = require('./commonfun');

const getStrInParentheses = (str, ch_l, ch_r) =>{
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
  return null
}

module.exports=parseTypeValue
