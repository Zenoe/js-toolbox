/**
  Question 5: please create a tool to generate Sequence
  Expected to be used like:
  var sequence1 = new Sequence();
  sequence1.next() --> return 1;
  sequence1.next() --> return 2;

  in another module:
  var sequence2 = new Sequence();
  sequence2.next() --> 3;
  sequence2.next() --> 4;
**/

const Sequence = function (){
  let counter = 0
  const next = () => (counter += 1)

  const reset = () => {counter = 0}

  function innerClass(){}
  innerClass.prototype = {
    next,
    reset,
  }
  return innerClass
}()


module.exports={
  Sequence,
}
