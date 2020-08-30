
function mynew(fn) {
  if(typeof fn !== 'function'){
    throw 'invalid param'
  }

  const obj = Object.create(fn);

  const args = [].slice.call(arguments, 1)

  const ins = fn.apply(obj, args)

  // typeof 'object' 'function'
  if(ins instanceof Object)
    return ins;


  return obj
}

Function.prototype.mycall = function(ctx){
  if(typeof ctx !== 'object'){
    throw 'invalid param'
  }
  const args = [].slice.call(arguments, 1)
  ctx.fn = this;
  ctx.fn(...args)
  delete ctx.fn;
}

Function.prototype.myapply = function(ctx){
  if(typeof ctx !== 'object'){
    throw 'invalid param'
  }
  const args = [].slice.call(arguments, 1)
  ctx.fn = this;
  ctx.fn(...args)
  delete ctx.fn;
}

Function.prototype.mybind = function(ctx){
  const args = [].slice.call(arguments, 1)
  const fn = this;
  return function(){
    var innerArgs = [].slice.class(arguments, 1)
    // fn.apply(ctx, args)
    fn.apply(ctx, innerArgs.concat(args))
  }
}
