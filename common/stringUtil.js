function randomString(plen = 32) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < plen; i+=1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function randomInt(pmin = 0, pmax = 100) {
  const min = Math.ceil(pmin);
  const max = Math.floor(pmax);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const isString = exp => (typeof (exp) === 'string' || exp instanceof String);

module.exports={
  randomString,
  randomInt,
  isString,
}
