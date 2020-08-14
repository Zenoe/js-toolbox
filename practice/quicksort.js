const commonfun = require('../common/commonfun');
function swapArray(a, i, j)
{
  const t = a[i];
  a[i] = a[j];
  a[j] = t;
};

function split(a,l,h) {
  let p = l-1;
  // let k = -1;
  const pivot = a[h]
  let q = l;
  // my ops: not: q < h-1 but: q < h
  for(q = l; q < h; q+=1){
    if(a[q] <= pivot){
      if(q > p+1){
        swapArray(a, q, p+1)
      }
      p += 1;
    }
  }

  swapArray(a, h, p+1)
  // my ops: return p, not return p+1, depends on the sub array splitted point
  return p;
}

function qsort(a, l, h) {
  if(l>=h){
    return;
  }
  m = split(a, l,h);
  qsort(a, l, m);
  qsort(a, m+1, h);
}


const len = 15;
const arr = commonfun.randomIntDataSet(len, 1,19)
console.log(arr);

qsort(arr, 0, len-1)
console.log(arr);

let arrtest = [3,3,3,3,3,3]
qsort(arrtest, 0, arrtest.length -1)
console.log(arrtest);

arrtest = [1,3,3,3,3,3]
qsort(arrtest, 0, arrtest.length -1)
console.log(arrtest);

arrtest = [3,3,3,3,3,0]
qsort(arrtest, 0, arrtest.length -1)
console.log(arrtest);
