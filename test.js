// 2020-08-11 14:25:13

const commonfun = require('./common/commonfun');

const keykeyMapObj = 
	[{
	  a:[3,4],
	  b:{c:2},
	  c:[{c1:3,c2:4}],
	  d:{dd:222},
	},
	 {e:99},
	 ]

 commonfun.objectList2File(`output.js`, ['xxx', keykeyMapObj ], false, true);


const { readdirSync } = require('fs')

const getDirectories = source =>
      readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

console.log(getDirectories('./'));

function rflatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function* flat(arr){
  for(let el of arr){
    if(Array.isArray(el)){
      yield* flat(el)
    }else{
      yield el;
    }
  }
  // you can't use yield inside a regular function
  // arr.forEach((el)=>{
  //   if(Array.isArray(el)){
  //     console.log('xxx');
  //     // yield is not defined
  //     yield* flat(el)
  //   }else{
  //     console.log(el);
  //     // yield el;
  //   }
  // })
}

function flatten(arr) {
  let res = [];
  for(let val of flat(arr)){
    res.push(val)
  }
  return res;
}

arrins = [[1,2,3],4,5,6,[[7]],[]]
console.log(flatten(arrins));

function sortExt(extensions) {
  const bucket = {
    'Dig':0,
    'Vir':1,
    'Fax':2,
    'AO': 3,
    'Dep':4,
  }
  const compare = (x, y)=>{
    return bucket[x.ext] - bucket[y.ext]
  }
  extensions.sort(compare)
  console.log(extensions);
}

// const extensions = [
//   {
//     name: 'lzy',
//     ext: 'Fax',
//   },
//   {
//     name: 'xyn',
//     ext: 'Dig',
//   },
//   {
//     name: 'yyy',
//     ext: 'AO',
//   },
//   {
//     name: 'xxlzy',
//     ext: 'Fax',
//   },

//   {
//     name: 'ioi',
//     ext: 'Vir',
//   },
//   {
//     name: 'sdfsdf',
//     ext: 'Dep',
//   }
// ]
// sortExt(extensions)



function Sequence() {
  this.next= function(){
    var cur = this.arr[0]
    cur += 1;
    this.arr[0] = cur;
    return cur;
  }

  // not ok
  this.nexti= function(){
    return ++this.init;
  }

  this.nexts = function(){
    return ++this.staticValue;
  }
}

Sequence.staticValue = 0;
Sequence.prototype.init = 0;

// elements in array shared by all instances
Sequence.prototype.arr = [0];

const seq = new Sequence();
console.log(seq.nexts());
return
console.log(seq.next()); // 1
console.log(seq.next()); // 2

console.log(seq.nexti()); // 1
console.log(seq.nexti()); // 2
const seq2 = new Sequence();

console.log(seq2.next());// 3
console.log(seq2.next());// 4

console.log(seq2.nexti());// 1
console.log(seq2.nexti());// 2


// class Tool {
//   static getSequence = function () {
//     return function Sequence() {
//       if (Sequence.instance) {
//         return Sequence.instance
//       }
//       Sequence.instance = (function* () {
//         let num = 0
//         while (true) {
//           yield ++num
//         }
//       })()
//       return Sequence.instance
//     }
//   }
// }


console.log('-------------------base-derive');
function base() {
  this.init = 0;
}

function derive() {
  this.next = function(){
    return ++ this.init;
  }
}
derive.prototype = new base();

d1 = new derive();
console.log(d1.next());
console.log(d1.next());
d2 = new derive();
console.log(d2.next());
console.log(d2.next());

