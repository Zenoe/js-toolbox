const commonfun = require('../common/commonfun');

// avoid randomly naming variables
// any variable name should be meanfull
function mergesort(a, l, h) {
  if(l >= h){
    return;
  }
  const m = Math.floor((l+h)/2);
  mergesort(a,l,m);
  mergesort(a,m+1,h);
  combine(a, l, m ,h);
}

function combine(a, l, m, h) {
  const a1 = [...a.slice(l,m+1)]  // [ l...m ]
  const a2 = [...a.slice(m+1,h+1)]  // [ m+1...h ]
  let i=0;
  let j=0;
  let k=l;
  while(i < a1.length && j < a2.length){
    // ops: a1, a2 is brand new array, should start with index 0, dont confuse with the origianl array a
    // caution: variables' name are ambiguous
    // if(a1[l+i] < a2[m+1+j]){
    if(a1[i] < a2[j]){
      // a[k++] = a[l+i]
      a[k++] = a1[i]
      i+=1;
    }else{
      // a[k++] = a[m+1+j]
      a[k++] = a2[j]
      j+=1;
    }
  }

  for(j; j<a2.length; j+=1){
    // a[k++] = a[m+1+j]
    a[k++] = a2[j]
  }

  for(i; i<a1.length; i+=1){
    // a[k++] = a[l+i]
    a[k++] = a1[i]
  }
}

const sortfun = mergesort

const len = 18;
const arr = commonfun.randomIntDataSet(len, 1,100)
console.log(arr);

sortfun(arr, 0, len-1)
console.log(arr);

let arrtest = [3,3,3,3,3,3]
sortfun(arrtest, 0, arrtest.length -1)
console.log(arrtest);

arrtest = [1,3,3,3,3,3]
sortfun(arrtest, 0, arrtest.length -1)
console.log(arrtest);

arrtest = [3,3,3,3,3,0]
sortfun(arrtest, 0, arrtest.length -1)
console.log(arrtest);
