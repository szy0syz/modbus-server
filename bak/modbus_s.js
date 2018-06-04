const fs = require('fs')
var modbus = require('modbus-stream')

modbus.tcp
  .server({ debug: 'server' }, connection => {
    connection.readCoils({ from: 3, to: 7 }, (err, info) => {
      if (err) {
        console.log(err)
        return
      }
      try {
        if (info.response) {
          console.log('response', info.response.data)
          fs.appendFile(
            'message.txt',
            info.response.data + '\n',
            'utf8',
            err => {
              if (err) throw err
              console.log('The file has been saved!')
            }
          )
        } else {
          console.log(info)
        }
      } catch (err) {
        console.error(err)
      }
    })
  })
  .listen(14444, '0.0.0.0', () => {
    console.log('服务器开启')
    // fs.appendFile('message.txt', '服务器开启' + '\n', 'utf8', err => {
    //   if (err) throw err
    //   console.log('The file has been saved!')
    // })
  })
