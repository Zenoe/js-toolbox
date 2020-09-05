/**
  saleItems is an Array has each item has such format:
  {
	month: n, //[1-12],
	date: n, //[1-31],
	transationId: "xxx",
	salePrice: number
  }
**/

/**
  Question 3: write a function to calculate and return a list of total sales (sum) for each quarter, expected result like:
  [
  	{quarter: 1, totalPrices: xxx, transactionNums: n},
  	{....}
  ]
**/


const {groupByQuarter} = require('./helper')
function sumByQuarter(saleItems) {
  const quarterGroups = groupByQuarter(saleItems)

  const reduceByPrice = (x, y) => (x + ( y.salePrice || 0 ))
  const reduceByTransactionNum = (x) => (x+1)

  const result = Object.keys(quarterGroups).map((quarter)=>(
    {
      quarter:parseInt(quarter, 10),
      totalPrices: parseFloat(quarterGroups[quarter].reduce(reduceByPrice, 0).toFixed(2)),
      transactionNums: quarterGroups[quarter].reduce(reduceByTransactionNum, 0),
    }
  ))

  return result;
}


module.exports = sumByQuarter
