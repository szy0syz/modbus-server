// var modbus = require('modbus-stream')
// modbus.tcp.connect(4444, '0.0.0.0', { debug: 'client' }, (err, connection) => {
//   connection.on('read-coils', (request, reply) => {
//     reply(null, [0, 0, 1, 1, 0, 0, 0, 0])
//   })
// })

var modbus = require('modbus-stream')

modbus.tcp.connect(
  4444,
  'home.jerryshi.com',
  { debug: 'Jerry-Test' },
  (err, connection) => {
    connection.on('read-coils', (request, reply) => {
      reply(null, [1, 0, 1, 0, 1, 1, 0, 1])
    })
    connection.readCoils({ from: 3, to: 7 }, (err, info) => {
      if (err) throw err
      console.log('我是接收数据')
      console.dir(info.response.data) // response
    })
    console.log('连上了服务端')
  }
)
