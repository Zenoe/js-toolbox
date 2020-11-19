// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
// (new Date()).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2-$1-$3');
// ==> "15-Oct-2020"
// moment(new Date()).format('YYYY-MM-DD HH:m:s');

import moment from 'moment'

function date2Formatted(d=new Date(), pad=true){
  if(pad){
    return (
      d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
        " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" +
        d.getSeconds().toString().padStart(2, '0')
    )
  }
  return d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
    d.getHours() + ":" + d.getMinutes()+ ":" + d.getSeconds();
}

function addHour(h, format) {
  const copiedDate = new Date();
  // copiedDate.setTime(this.getTime() + (h*60*60*1000));
  copiedDate.setHours(copiedDate.getHours() + h);

  if(format){
    return moment(copiedDate).format('YYYY-MM-DD hh:mm:ss')
  }
  return copiedDate;
}

// H vs h is difference between 24 hour vs 12 hour format.

function getTimeStamp(){
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const date = today.getFullYear()+'-'+mm+'-'+dd;
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
  return dateTime;
}

module.exports={
  date2Formatted,
  getTimeStamp,
  addHour,
}
