'use strict'

const fs = require('fs')
let net = require('net')
let modbus = require('jsmodbus')
let netServer = new net.Server()
let server = new modbus.server.TCP(netServer)

//////////
const path = require('path')
const mongoose = require('mongoose')
const config = require('./config.json')

mongoose.plugin(require('./database/plugins/meta'))
const modelsPath = path.resolve(__dirname, './database/schema')

// 加载database/schema/目录下的model文件
fs
  .readdirSync(modelsPath)
  .filter(file => ~file.search(/\.js$/))
  .forEach(file => require(path.resolve(modelsPath, file)))

const mainModel = mongoose.model('main')
const logModel = mongoose.model('log')
/////////

server.on('connection', function (client) {
  console.log('New Connection')

  mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
    console.log('Connected to MongoDB ', config.db)
  })
})

server.on('readCoils', function (request, response, send) {
  /* Implement your own */
  console.log('on-readCoils~~~')
  console.log(request)
  response.body.coils[0] = true
  response.body.coils[1] = false

  send(response)
})

server.on('readHoldingRegisters', function (request, response, send) {
  /* Implement your own */
})

server.on('preWriteSingleRegister', function (value, address) {
  console.log('Write Single Register')
  console.log(
    'Original {register, value}: {',
    address,
    ',',
    server.holding.readUInt16BE(address),
    '}'
  )
})

server.on('WriteSingleRegister', function (value, address) {
  console.log(
    'New {register, value}: {',
    address,
    ',',
    server.holding.readUInt16BE(address),
    '}'
  )
})

server.on('writeMultipleCoils', function (value) {
  console.log('Write multiple coils - Existing: ', value)
})

server.on('postWriteMultipleCoils', function (value) {
  console.log('Write multiple coils - Complete: ', value)
})

server.on('writeMultipleRegisters', function (value) {
  console.log('Write multiple registers - Existing: ', value)
})

server.on('postWriteMultipleRegisters', function (value) {
  console.log('Write multiple registers - Complete: ', value)
})

// const writeStream = fs.createWriteStream("modbus.bin") 

// writeStream.on("open", function(fd) {
//   console.log("需要被写入的文件已被打开。");
// })

// writeStream.end("The end.", function() {
//   console.log("文件全部写入完毕。");
//   console.log("共写入%d字节数据。", writeStream.bytesWritten);
// })

server.on('connection', function (client) {
  console.log('recive DTU:')
  client.socket.on('data', data => {

    console.log(new Date().toLocaleString())
    console.dir(client.socket.remoteAddress)

    console.info(data)
    console.log(data.toString('ascii'))

    let res
    try {
      if (isValid(data)) {
        res = new RtuData(data)
        console.log('收到数据包')
        console.dir(res)
        res = new mainModel(res)
        res.save()
      } else {
        console.error('收到无法解析的数据')
        res = new logModel()
        res.data = data
        res.save()
      }
    } catch (err) {
      console.error(err)
    }


    fs.appendFile(
      'data.bin',
      data,
      'utf-8',
      err => {
        if (err) throw err
        console.log('The file has been saved!')
      }
    )

  })
})

// server.coils.writeUInt16BE(0x0000, 0)
// server.coils.writeUInt16BE(0x0000, 2)
// server.coils.writeUInt16BE(0x0000, 4)
// server.coils.writeUInt16BE(0x0000, 6)

// server.discrete.writeUInt16BE(0x5678, 0)

// server.holding.writeUInt16BE(0x0000, 0)
// server.holding.writeUInt16BE(0x0000, 2)

// server.input.writeUInt16BE(0xff00, 0)
// server.input.writeUInt16BE(0xff00, 2)

netServer.listen(14444, function () {
  console.log('TCP serv is start at 14444 port.')
})

function isValid(data) {
  // TODO: 验证数据包是否合法(暂时只要一个数据包情况)
  return !!(data.indexOf('01410058', 0, 'hex') >= 0)
}

function RtuData(data) {
  this.optCode = data.slice(0, 2)  // -> 0x01 0x41
  this.count = 1  // -> 封包数量
  this.oriData = data.slice(4, data.length - 6)  // TODO: 迭代
  this.data = [   // ->　数据包
    {
      date: this.oriData.slice(0, 4),
      DI: this.oriData.slice(4, 6),
      DO: this.oriData.slice(6, 8),
      analogReg: this.oriData.slice(8, 8 + 16),
      innerReg: this.oriData.slice(24, 24 + 16),
      outerReg: this.oriData.slice(40, this.oriData.length)
    }
  ]
  this.crc = data.slice(data.length - 2, data.length)
}
