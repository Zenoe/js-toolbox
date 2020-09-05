
function cbfun(param, callback){
  console.log('cbfun->param:', param);

  // setTimeout(callback, 0);
  setTimeout(()=>{callback(param)}, 0);
}

cbfun(3, ()=>{console.log('from inside callback')})

function cbfunPromise(param){
  return new Promise((resolve, reject) =>{
    cbfun(param, (()=>{
      if(param > 0)
        resolve(param)
      else
        reject(param)
    }))
  } )
}

// cbfunPromise(33).then(res=>{
//   console.log('result from then:', res);
// }).catch(res=>{
//   console.log('reject :', res);
// })

// cbfunPromise(-33).then(res=>{
//   console.log('result from then:', res);
// }).catch(res=>{
//   console.log('reject :', res);
// })

function promisify(f){
  return function(...arg){
    return new Promise((resolve, reject)=>{
      function callback(param){
        if(param > 0)
          resolve(param)
        else
          reject(param)
      }

      arg.push(callback)
      f.call(this, ...arg)
    })
  }
}

const cbfunPromisfy = promisify(cbfun);
cbfunPromisfy(222).then((res)=>{
  console.log('then:', res);
}).catch(res=>{
  console.log('reject:', res);
})

cbfunPromisfy(-222).then((res)=>{
  console.log('then:', res);
}).catch((res)=>{
  console.log('reject:', res);
})

console.log('-------------------------');
function retPromise(arg) {
  return new Promise((resolve, reject)=>{
    if(arg){
      resolve('arg is true')
    }else{
      reject(new Error('argisfalse'))
    }
  })
}

retPromise(true).then(resolve=>console.log('resolve', resolve))
                 .catch(reject=>console.log(reject.message))
retPromise(false).then(resolve=>console.log('resolve', resolve))
                 .catch(reject=>console.log(reject.message))
