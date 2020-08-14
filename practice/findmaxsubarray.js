
const commonfun = require('../common/commonfun');

function findmaxsubarray(arr, low, high) {
  if(low > high){
    throw 'error parameters'
  }
  if(low === high){
    return [low, high, arr[low]];
  }
  const mid = Math.floor((low+high)/2);
  const [leftIdx1, rightIdx1, sum1] = findmaxsubarray(arr, low, mid);
  const [leftIdx2, rightIdx2, sum2] = findmaxsubarray(arr, mid+1, high);
  const [crossMidLeftIdx, crossMidRightIdx, crossMidSum] = findmaxsubarrayCrossMid(arr, low, mid, high);
  if(sum1 > sum2 && sum1 > crossMidSum){
    return [leftIdx1, rightIdx1, sum1]
  }
  if(sum2 > sum1 && sum2 > crossMidSum){
    return [leftIdx2, rightIdx2, sum2]
  }

  return [crossMidLeftIdx, crossMidRightIdx, crossMidSum];
}

function findmaxsubarrayCrossMid(arr, low, mid, high){
  let sum = arr[mid];
  let tmpSum = sum;

  let left = mid;
  let right = mid;

  for(let i=mid-1; i>=low; i-=1){
    tmpSum += arr[i];
    if(tmpSum > sum){
      sum = tmpSum;
      left = i;
    }
  }

  tmpSum = sum;
  for(let j=mid+1; j<=high; j+=1){
    tmpSum += arr[j];
    if(tmpSum > sum){
      sum = tmpSum;
      right = j
    }
  }

  return [left, right, sum];
}

let arr = [2,0,1,-2,4,5,-6,7, 0,0,-1, 2]
let res = findmaxsubarray(arr, 0, arr.length-1)
console.log(res);
arr = [2,-1,0,1,-2,4,5,-6,7, 0,0,-1, 2]
res = findmaxsubarray(arr, 0, arr.length-1)
console.log(res);

arr = [2,-1,2,1,-2,4,5,-6,7, 0,0,-1, 2]
res = findmaxsubarray(arr, 0, arr.length-1)
console.log(res);
