const sortExtensionsByName = require('./solution1');

const extension= [
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
]

const extensions1 = [
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'mike', lastName: 'Freen', ext: 'ww', extType: 'b'},
  {firstName: 'ross', lastName: 'Ramond', ext: 'nxa', extType: 'c'},
  {firstName: 'tom', lastName: 'Jodern', ext: 'ccc', extType: 'd'},
  {firstName: 'Jim', lastName: 'White', ext: 'yyy', extType: 'e'},
  {firstName: 'jam', lastName: 'King', ext: 'yoo', extType: 'a'},
]

expected_extensions1 = [
  {firstName: 'Jim', lastName: 'White', ext: 'yyy', extType: 'e'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'jam', lastName: 'King', ext: 'yoo', extType: 'a'},
  {firstName: 'mike', lastName: 'Freen', ext: 'ww', extType: 'b'},
  {firstName: 'ross', lastName: 'Ramond', ext: 'nxa', extType: 'c'},
  {firstName: 'tom', lastName: 'Jodern', ext: 'ccc', extType: 'd'},
]

// no distinct elements
const extensions2 = [
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
]

const exp_extensions2 = [
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
]

const extensions3 = [
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'aob', lastName: 'Green', ext: 'xx', extType: 'a'},
]

const exp_extensions3 = [
  {firstName: 'aob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bob', lastName: 'Green', ext: 'xx', extType: 'a'},
]

// order by firstName only
const extensions4 = [
  {firstName: 'cc', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'aa', lastName: 'Green', ext: 'xx', extType: 'a'},
]
const exp_extensions4 = [
  {firstName: 'aa', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'Green', ext: 'xx', extType: 'a'},
  {firstName: 'cc', lastName: 'Green', ext: 'xx', extType: 'a'},
]

// order by firstName and lastName
const extensions5 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'dd', ext: 'xx', extType: 'a'},
  {firstName: 'aa', lastName: 'ff', ext: 'xx', extType: 'a'},
]
const exp_extensions5 = [
  {firstName: 'aa', lastName: 'ff', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'dd', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
]

// order by firstName and lastName and ext
const extensions6 = [
  {firstName: 'bb', lastName: 'ff', ext: 'yx', extType: 'a'},
  {firstName: 'bb', lastName: 'dd', ext: 'xx', extType: 'a'},
  {firstName: 'aa', lastName: 'ff', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'wx', extType: 'a'},
]

const exp_extensions6 = [
  {firstName: 'aa', lastName: 'ff', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'dd', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'wx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'yx', extType: 'a'},
]

// order by lastName and ext
const extensions7 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'yx', extType: 'a'},
]

const exp_extensions7 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'yx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'xx', extType: 'a'},
]

// order by lastName
const extensions8 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'aa', ext: 'xx', extType: 'a'},
]

const exp_extensions8 = [
  {firstName: 'bb', lastName: 'aa', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ff', ext: 'xx', extType: 'a'},
]

// order by ext
const extensions9 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'yy', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'ww', extType: 'a'},
]
const exp_extensions9 = [
  {firstName: 'bb', lastName: 'ee', ext: 'ww', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'yy', extType: 'a'},
]


// empty firstName
const extensions10 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: '', lastName: 'ee', ext: 'yy', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'ww', extType: 'a'},
]

const exp_extensions10 = [
  {firstName: '', lastName: 'ee', ext: 'yy', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'ww', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
]

// empty lastName
const extensions11 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  {firstName: 'bb', lastName: '', ext: 'yy', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'ww', extType: 'a'},
]

const exp_extensions11 = [
  {firstName: 'bb', lastName: '', ext: 'yy', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'ww', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
]

// some properties missing
const extensions12 = [
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
  { lastName: '', ext: 'yy', extType: 'a'},
  { lastName: 'ee', ext: 'ww', extType: 'a'},
]

const exp_extensions12 = [
  { lastName: '', ext: 'yy', extType: 'a'},
  { lastName: 'ee', ext: 'ww', extType: 'a'},
  {firstName: 'bb', lastName: 'ee', ext: 'xx', extType: 'a'},
]

// test('xxxx', ()=>expect(extensions3).toStrictEqual(extensions4))

test('empty array', ()=>{
  expect(sortExtensionsByName([])).toStrictEqual([])
})

test('1 element array', ()=>{
  expect(sortExtensionsByName(extension)).toStrictEqual(extension)
})

test('all elements are totally different', ()=>{
  expect(sortExtensionsByName(extensions1)).toStrictEqual(expected_extensions1)
})

test('all elements are different with some elements shared some properties', ()=>{
  expect(sortExtensionsByName(extensions2)).toStrictEqual(exp_extensions2)
})

// this test case failed. because extensions3 is of reference type
// test('part of the elements are same', ()=>{
//   expect(sortExtensionsByName(extensions3)).not.toStrictEqual(extensions3)
// })

test('part of the elements are same', ()=>{
  expect(sortExtensionsByName(extensions3)).toStrictEqual(exp_extensions3)
})

test('order by firstName only', ()=>{
  expect(sortExtensionsByName(extensions4)).toStrictEqual(exp_extensions4)
})

test('order by firstName and lastName', ()=>{
  expect(sortExtensionsByName(extensions5)).toStrictEqual(exp_extensions5)
})

test('order by firstName and lastName and ext', ()=>{
  expect(sortExtensionsByName(extensions6)).toStrictEqual(exp_extensions6)
})

test('order by lastName', ()=>{
  expect(sortExtensionsByName(extensions6)).toStrictEqual(exp_extensions6)
})

test('order by lastName and ext', ()=>{
  expect(sortExtensionsByName(extensions7)).toStrictEqual(exp_extensions7)
})

test('order by lastName only', ()=>{
  expect(sortExtensionsByName(extensions8)).toStrictEqual(exp_extensions8)
})

test('order by ext only', ()=>{
  expect(sortExtensionsByName(extensions9)).toStrictEqual(exp_extensions9)
})

test('empty firstName', ()=>{
  expect(sortExtensionsByName(extensions10)).toStrictEqual(exp_extensions10)
})

test('empty lastName', ()=>{
  expect(sortExtensionsByName(extensions11)).toStrictEqual(exp_extensions11)
})

test('some properties missing', ()=>{
  expect(sortExtensionsByName(extensions12)).toStrictEqual(exp_extensions12)
})

test('invalid param test', ()=>{
  const t = ()=>sortExtensionsByName(1);
  expect(t).toThrow('only accept array parameter')
})
