// var _  = require("lodash");
const iconv = require("iconv-lite");
const fs = require("fs");
const d3  = require('d3')

const chardet = require('chardet');

const datapath='./csv/d3csvtest.csv'

const isFileGBK = (datapath) => {
  chardet.detectFile(datapath, function(err, encoding) {
    if(encoding === "Big5" || encoding === "GB18030" ){
      // gbk
      console.log('gbk');
    }
  });
}


fs.readFile(datapath, function(error, data) {
  let tmpdata = iconv.decode(data, 'gbk')
  tmpdata = d3.csvParse(tmpdata);

  // console.log(JSON.stringify(tmpdata));

  tmpdata.forEach(d=>{
    console.log(d);
  })
  // var maxWeight = d3.max(data, function(d) { return d.avg_weight; });
  // console.log(maxWeight);
});
