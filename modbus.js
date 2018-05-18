const fs = require('fs')
var modbus = require('modbus-stream')

modbus.tcp
  .server({ debug: 'server' }, connection => {
    connection.readCoils({ from: 3, to: 7 }, (err, info) => {
      console.log('response', info.response.data)
      fs.appendFile('message.txt', info.response.data + '\n', 'utf8', err => {
        if (err) throw err
        console.log('The file has been saved!')
      })
    })
  })
  .listen(4444, '0.0.0.0', () => {
    modbus.tcp.connect(4444, { debug: 'client' }, (err, connection) => {
      connection.on('read-coils', (request, reply) => {
        reply(null, [0, 0, 1, 1, 0, 0, 0, 0])
      })
    })
    fs.appendFile('message.txt', '服务器开启' + '\n', 'utf8', err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
