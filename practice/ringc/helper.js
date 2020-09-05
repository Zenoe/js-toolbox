const assert = (condition, message) => {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message; // Fallback
  }
}

const isJustAObj = (obj) => {
    return !!obj && obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]'
}

/*
 * return true when the provided month and date form a valid date
 * if date is undefined, that means only month matters,
 * so I provided an default value for date
 */
const isMonthDateValid = (month, date=1, year = new Date().getFullYear())=>{
  const bigMonth = [1,3,5,7,8,10,12];
  const smallMonth = [4,6,9,11];
  if(bigMonth.includes(month)){
    return date >= 1 && date <= 31
  }
  if(smallMonth.includes(month)){
    return date >= 1 && date <= 30
  }
  if(month === 2){
    const leapYear = year % 4 === 0;
    return date >= 1 && date <= (leapYear? 29: 28)
  }
  return false;
}

const groupByQuarter = (saleItems)=>{
  const groups={
    1: [],
    2: [],
    3: [],
    4: [],
    // 'unknown': [],
  }
  saleItems.forEach((it, idx)=>{
    if(!isMonthDateValid(it.month, it.date)){
      // filter out invalid values
      // groups['unknown'].push(it);
      return;
    }
    const quarter = Math.ceil(it.month / 3);
    groups[quarter].push(it);
  })
  return groups;
}

function hasProperties(obj, propArray){
  assert(isJustAObj(obj) && Array.isArray(propArray), "Invalid params for hasProperties")
  for(let i=0; i<propArray.length; i+=1){
    if(!obj.hasOwnProperty(propArray[i])){
      return false;
    }
  }
  return true;
}

module.exports = {
  isMonthDateValid,
  groupByQuarter,
  isJustAObj,
  assert,
}
