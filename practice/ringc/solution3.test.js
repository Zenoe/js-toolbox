const sumByQuarter = require('./solution3')

const exp_saleItems = [
  { quarter: 1, totalPrices: 0, transactionNums: 0 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 0, transactionNums: 0 }
]
test('empty array', ()=>{
  expect(sumByQuarter([])).toStrictEqual(exp_saleItems)
})

const saleItems0 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
]

const exp_saleItems0 = [
  { quarter: 1, totalPrices: 33.3, transactionNums: 1 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 0, transactionNums: 0 }
]

test('one transaction', ()=>{
  expect(sumByQuarter(saleItems0)).toStrictEqual(exp_saleItems0)
})

const saleItems1 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 1, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 1, date: 9, transationId: "xxx", salePrice: 33.3},
]

const exp_saleItems1=[
  { quarter: 1, totalPrices: 99.9, transactionNums: 3 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 0, transactionNums: 0 }
]

test('more than one transaction in the same month', ()=>{
  expect(sumByQuarter(saleItems1)).toStrictEqual(exp_saleItems1)
})

const saleItems2 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 1, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
]

const exp_saleItems2=[
  { quarter: 1, totalPrices: 199.9, transactionNums: 4 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 0, transactionNums: 0 }
]

test('more than one transaction in the same quater', ()=>{
  expect(sumByQuarter(saleItems2)).toStrictEqual(exp_saleItems2)
})

const saleItems3 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 1, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
  {month: 4, date: 19, transationId: "xxx", salePrice: 33.3},
  {month: 6, date: 1, transationId: "xxx", salePrice: 200},
  {month: 5, date: 1, transationId: "xxx", salePrice: 100},
]

const exp_saleItems3 = [
  { quarter: 1, totalPrices: 233.2, transactionNums: 5 },
  { quarter: 2, totalPrices: 333.3, transactionNums: 3 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 0, transactionNums: 0 }
]

test('more than one transaction in two quaters', ()=>{
  expect(sumByQuarter(saleItems3)).toStrictEqual(exp_saleItems3)
})

const saleItems4 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
  {month: 4, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 6, date: 1, transationId: "xxx", salePrice: 10},
  {month: 8, date: 1, transationId: "xxx", salePrice: 99},
  {month: 9, date: 1, transationId: "xxx", salePrice: 100},
  {month: 7, date: 11, transationId: "xxx", salePrice: 100},
  {month: 7, date: 10, transationId: "xxx", salePrice: 100},
  {month: 7, date: 1, transationId: "xxx", salePrice: 100},
  {month: 8, date: 1, transationId: "xxx", salePrice: 100},
  {month: 8, date: 30, transationId: "xxx", salePrice: 100},
  {month: 9, date: 21, transationId: "xxx", salePrice: 100},
]

const exp_saleItems4 = [
  { quarter: 1, totalPrices: 199.9, transactionNums: 4 },
  { quarter: 2, totalPrices: 43.3, transactionNums: 2 },
  { quarter: 3, totalPrices: 799, transactionNums: 8 },
  { quarter: 4, totalPrices: 0, transactionNums: 0 }
]
test('more than one transaction in three quaters', ()=>{
  expect(sumByQuarter(saleItems4)).toStrictEqual(exp_saleItems4)
})

const saleItems5 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
  {month: 4, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 6, date: 1, transationId: "xxx", salePrice: 10},
  {month: 8, date: 1, transationId: "xxx", salePrice: 99},
  {month: 9, date: 1, transationId: "xxx", salePrice: 100},
  {month: 10, date: 1, transationId: "xxx", salePrice: 100},
  {month: 10, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 12, date: 30, transationId: "xxx", salePrice: 100},
  {month: 12, date: 31, transationId: "xxx", salePrice: 100},
]
const exp_saleItems5 = [
  { quarter: 1, totalPrices: 199.9, transactionNums: 4 },
  { quarter: 2, totalPrices: 43.3, transactionNums: 2 },
  { quarter: 3, totalPrices: 199, transactionNums: 2 },
  { quarter: 4, totalPrices: 600, transactionNums: 6 }
]
test('more than one transaction in four quaters', ()=>{
  expect(sumByQuarter(saleItems5)).toStrictEqual(exp_saleItems5)
})


const saleItems6 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
  {month: 10, date: 1, transationId: "xxx", salePrice: 100},
  {month: 10, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 12, date: 30, transationId: "xxx", salePrice: 100},
  {month: 12, date: 31, transationId: "xxx", salePrice: 100},
]
const exp_saleItems6 = [
  { quarter: 1, totalPrices: 199.9, transactionNums: 4 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 600, transactionNums: 6 }
]

test('only the first quater and the last quarter have transactions', ()=>{
  expect(sumByQuarter(saleItems6)).toStrictEqual(exp_saleItems6)
})

const saleItems7 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 11, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
  {date: 1, transationId: "xxx", salePrice: 100},
  {date: 1, transationId: "xxx", salePrice: 100},
  {month: 9, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 12, date: 30, transationId: "xxx", salePrice: 100},
  {month: 12, date: 31, transationId: "xxx", salePrice: 100},
]
const exp_saleItems7 = [
  { quarter: 1, totalPrices: 199.9, transactionNums: 4 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 100, transactionNums: 1 },
  { quarter: 4, totalPrices: 400, transactionNums: 4 }
]

test('some items don not have month or date property', ()=>{
  expect(sumByQuarter(saleItems7)).toStrictEqual(exp_saleItems7)
})

const saleItems8 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 30, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 3, transationId: "xxx", salePrice: 100},
  {month: 3, date: 9, transationId: "xxx", salePrice: 33.3},
  {month: 0, date: 9, transationId: "xxx", salePrice: 33.3},
  {month: 7, date: 0, transationId: "xxx", salePrice: 100},
  {month: 7, date: 32, transationId: "xxx", salePrice: 100},
  {month: 7, date: 1, transationId: "xxx", salePrice: 100},
  {month: 10, date: 1, transationId: "xxx", salePrice: 100},
  {month: 10, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 11, date: 1, transationId: "xxx", salePrice: 100},
  {month: 12, date: 30, transationId: "xxx", salePrice: 100},
  {month: 13, date: 31, transationId: "xxx", salePrice: 100},
]
const exp_saleItems8 = [
  { quarter: 1, totalPrices: 166.6, transactionNums: 3 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 100, transactionNums: 1 },
  { quarter: 4, totalPrices: 500, transactionNums: 5 }
]
test('there are items got invalid date', ()=>{
  expect(sumByQuarter(saleItems8)).toStrictEqual(exp_saleItems8)
})

const saleItems9 = [
  {month: 1, date: 1, transationId: "xxx", salePrice: 33.3},
  {month: 2, date: 28, transationId: "xxx", salePrice: 33.3},
  {month: 3, date: 9, transationId: "xxx", },
  {month: 11, date: 1, transationId: "xxx", },
  {month: 12, date: 30, transationId: "xxx", salePrice: 100},
  {month: 13, date: 31, transationId: "xxx"},
]
const exp_saleItems9 = [
  { quarter: 1, totalPrices: 66.6, transactionNums: 3 },
  { quarter: 2, totalPrices: 0, transactionNums: 0 },
  { quarter: 3, totalPrices: 0, transactionNums: 0 },
  { quarter: 4, totalPrices: 100, transactionNums: 2 }
]
test('there are some items lose their totalPrices or transactionNums', ()=>{
  expect(sumByQuarter(saleItems9)).toStrictEqual(exp_saleItems9)
})
