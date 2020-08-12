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

