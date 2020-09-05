// sort by order:   DigitalUser < VitrualUser < FaxUser < AO < Dept.

const sortExtensionsByExtType = require('./solution2');
const extensions0 = [
  {name: 'sdfsdf', ext: 'Dept',},
]

const exp_extensions0 = [
  {name: 'sdfsdf', ext: 'Dept',},
]

const extensions1 = [
  {name: 'zzlzy', ext: 'FaxUser',},
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'yyy', ext: 'AO',},
  {name: 'ioi', ext: 'VirtualUser',},
  {name: 'sdfsdf', ext: 'Dept',},
]

const exp_extensions1 = [
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'ioi', ext: 'VirtualUser',},
  {name: 'zzlzy', ext: 'FaxUser',},
  {name: 'yyy', ext: 'AO',},
  {name: 'sdfsdf', ext: 'Dept',},
]

const extensions2 = [
  {name: 'zzlzy', ext: 'FaxUser',},
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'yyy', ext: 'AO',},
  {name: 'xxlzy', ext: 'FaxUser',},
  {name: 'ioi', ext: 'VirtualUser',},
  {name: 'sdfsdf', ext: 'Dept',}
]

const exp_extensions2 = [
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'ioi', ext: 'VirtualUser',},
  {name: 'zzlzy', ext: 'FaxUser',},
  {name: 'xxlzy', ext: 'FaxUser',},
  {name: 'yyy', ext: 'AO',},
  {name: 'sdfsdf', ext: 'Dept',}
]

const extensions3 = [
  {name: 'yyy', ext: 'AO',},
  {name: 'zzlzy', ext: 'FaxUser',},
  {name: 'xyn', ext: 'FaxUser',},
  {name: 'ioi', ext: 'AO',},
  {name: 'sdfsdf', ext: 'Dept',}
]

const exp_extensions3 = [
  {name: 'zzlzy', ext: 'FaxUser',},
  {name: 'xyn', ext: 'FaxUser',},
  {name: 'yyy', ext: 'AO',},
  {name: 'ioi', ext: 'AO',},
  {name: 'sdfsdf', ext: 'Dept',}
]

const extensions4 = [
  {name: 'zzlzy', ext: 'VirtualUser',},
  {name: 'sdfsdf', ext: 'Dept',},
  {name: 'xyn', ext: 'VirtualUser',},
  {name: 'yyy', ext: 'VirtualUser',},
  {name: 'ioi', ext: 'VirtualUser',},
]

const exp_extensions4 = [
  {name: 'zzlzy', ext: 'VirtualUser',},
  {name: 'xyn', ext: 'VirtualUser',},
  {name: 'yyy', ext: 'VirtualUser',},
  {name: 'ioi', ext: 'VirtualUser',},
  {name: 'sdfsdf', ext: 'Dept',}
]

const extensions5 = [
  {name: 'zzlzy', ext: 'DigitalUser',},
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'yyy', ext: 'DigitalUser',},
  {name: 'ioi', ext: 'DigitalUser',},
  {name: 'sdfsdf', ext: 'DigitalUser',}
]

const exp_extensions5 = [
  {name: 'zzlzy', ext: 'DigitalUser',},
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'yyy', ext: 'DigitalUser',},
  {name: 'ioi', ext: 'DigitalUser',},
  {name: 'sdfsdf', ext: 'DigitalUser',}
]

const extensions6 = [
  {name: 'zzlzy', },
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'yyy', ext: 'DigitalUser',},
  {name: 'ioi', ext: 'DigitalUser',},
  {name: 'sdfsdf', ext: 'DigitalUser',}
]
const exp_extensions6 = [
  {name: 'zzlzy', },
  {name: 'xyn', ext: 'DigitalUser',},
  {name: 'yyy', ext: 'DigitalUser',},
  {name: 'ioi', ext: 'DigitalUser',},
  {name: 'sdfsdf', ext: 'DigitalUser',},
]

test('empty array', ()=>{
  expect(sortExtensionsByExtType([])).toStrictEqual([])
})

test('order 1 element', ()=>{
  expect(sortExtensionsByExtType(extensions0)).toStrictEqual(exp_extensions0)
})

test('order 4 different elements', ()=>{
  expect(sortExtensionsByExtType(extensions1)).toStrictEqual(exp_extensions1)
})

test('order 5 different elements, tow of which share the saem ext', ()=>{
  expect(sortExtensionsByExtType(extensions2)).toStrictEqual(exp_extensions2)
})

test('order 5 different elements, only 3 different type of ext', ()=>{
  expect(sortExtensionsByExtType(extensions3)).toStrictEqual(exp_extensions3)
})

test('order 5 different elements, only 2 different type of ext', ()=>{
  expect(sortExtensionsByExtType(extensions4)).toStrictEqual(exp_extensions4)
})

test('order 5 different elements, all with same ext', ()=>{
  expect(sortExtensionsByExtType(extensions5)).toStrictEqual(exp_extensions5)
})

test('some elements miss the ext prop', ()=>{
  expect(sortExtensionsByExtType(extensions6)).toStrictEqual(exp_extensions6)
})
