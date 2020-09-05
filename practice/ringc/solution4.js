/**
  Question 4: write a function to calculate and return a list of average sales
  for each quarter, expected result like:
  [
    {quarter: 1, averagePrices: xxx, transactionNums: n},
    {....}
  ]
**/

const {groupByQuarter} = require('./helper')
function averageByQuarter(saleItems) {

  const quarterGroups = groupByQuarter(saleItems)

  const reduceByTransactionNum = (x) => (x+1)

  // if salePrice is undefined, make it 0 or just filter out the record ?
  const reduceAverageSalesPrice = (avg, current, _, {length}) => ( avg + ( current.salePrice || 0) / length )

  const result = Object.keys(quarterGroups).map((quarter)=>(
    {
      quarter:parseInt(quarter, 10),
      transactionNums: quarterGroups[quarter].reduce(reduceByTransactionNum, 0),
      averagePrices: parseFloat(quarterGroups[quarter].reduce(reduceAverageSalesPrice, 0).toFixed(2)),
    }
  ))

  return result
}

module.exports = averageByQuarter
