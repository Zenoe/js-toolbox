const { Sequence } = require('./solution5');

// module solution5.test1 doesn't call next()
const aa = require('./solution5.test1')

// module solution5.test2 calls next() once
const bb = require('./solution5.test2')

const a = new Sequence();

const b = new Sequence();

test('normal test', ()=>{
  expect(a.next()).toBe(2)
})

test('normal test', ()=>{
  expect(a.next()).toBe(3)
})

test('normal test', ()=>{
  expect(b.next()).toBe(4)
})

test('normal test', ()=>{
  expect(b.next()).toBe(5)
})

test('module bb test ', ()=>{
  expect(bb.next()).toBe(6)
})

test('module aa test ', ()=>{
  expect(aa.next()).toBe(7)
})

test('normal test after reset', ()=>{
  const t = ()=>{
    a.reset();
    return [a.next(), b.next()]
  }
  expect(t()).toStrictEqual([1,2])
})

test('module-crossed test after reset', ()=>{
  const t = ()=>{
    a.reset();
    return [a.next(), b.next(), aa.next(), bb.next()]
  }
  expect(t()).toStrictEqual([1, 2, 3, 4])
})
