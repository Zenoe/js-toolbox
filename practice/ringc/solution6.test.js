const { getUnUsedKeys  } = require('./solution6');

const intRange = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);
const a = intRange(0,9);
const b = [2,3,4]

test('normal test', ()=>{
  expect(getUnUsedKeys(['ch','jim', 'usa'], ['jim'])).toStrictEqual(['ch', 'usa'])
})

test('normal test', ()=>{
  expect(getUnUsedKeys(a, b)).toStrictEqual([ 0, 1, 5, 6, 7, 8,9])
})

test('test used up allKeys', ()=>{
  expect(getUnUsedKeys(a, a)).toStrictEqual([])
})

test('test used up allKeys', ()=>{
  expect(getUnUsedKeys([1,2,3], [1,2,3,4])).toStrictEqual([])
})

test('test duplicated keys in allKeys ', ()=>{
  expect(getUnUsedKeys([1,1,2,2,3,4], [1,2,3])).toStrictEqual([4])
})

test('test duplicated keys in usedKeys ', ()=>{
  expect(getUnUsedKeys([1,2,3,4], [1,2,1])).toStrictEqual([3,4])
})

test('test duplicated keys in allKeys and usedKeys ', ()=>{
  expect(getUnUsedKeys([1,1,2,2,3,3,4], [1,2,1])).toStrictEqual([3,3,4])
})

test('both arraies are empty', ()=>{
  expect(getUnUsedKeys([], [])).toStrictEqual([])
})

test('test allKeys is empty', ()=>{
  expect(getUnUsedKeys([], b)).toStrictEqual([])
})

test('test usedKeys is empty', ()=>{
  expect(getUnUsedKeys(a, [])).toStrictEqual(a)
})

test('test usedKeys has keys what is not equal to any key in the allKeys array', ()=>{
  expect(getUnUsedKeys(a, [-1,-7])).toStrictEqual(a)
})

test('test some keys in usedKeys are not equal to any key in the allKeys array', ()=>{
  expect(getUnUsedKeys(a, [-1,-7, 0])).toStrictEqual([1,2,3,4,5,6,7,8,9])
})

test('no param test', ()=>{
  const t = ()=>getUnUsedKeys();
  expect(t).toThrow('only accept array parameter')
})

test('invalid param test', ()=>{
  const t = ()=>getUnUsedKeys(a,1);
  expect(t).toThrow('only accept array parameter')
})

test('invalid param test', ()=>{
  const t = ()=>getUnUsedKeys(1,b);
  expect(t).toThrow('only accept array parameter')
})

// test('test throw', ()=>{
//   const t = ()=>testt()
//   expect(t).toThrow(TypeError);
//   // expect(t).toThrow('only accept array parameter')
// })
