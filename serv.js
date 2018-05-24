'use strict'

let net = require('net')
let modbus = require('jsmodbus')
let netServer = new net.Server()
let server = new modbus.server.TCP(netServer)

server.on('connection', function(client) {
  console.log('New Connection')
})

server.on('readCoils', function(request, response, send) {
  /* Implement your own */
  console.log('on-readCoils~~~')
  console.log(request)
  response.body.coils[0] = true
  response.body.coils[1] = false

  send(response)
})

server.on('readHoldingRegisters', function(request, response, send) {
  /* Implement your own */
})

server.on('preWriteSingleRegister', function(value, address) {
  console.log('Write Single Register')
  console.log(
    'Original {register, value}: {',
    address,
    ',',
    server.holding.readUInt16BE(address),
    '}'
  )
})

server.on('WriteSingleRegister', function(value, address) {
  console.log(
    'New {register, value}: {',
    address,
    ',',
    server.holding.readUInt16BE(address),
    '}'
  )
})

server.on('writeMultipleCoils', function(value) {
  console.log('Write multiple coils - Existing: ', value)
})

server.on('postWriteMultipleCoils', function(value) {
  console.log('Write multiple coils - Complete: ', value)
})

server.on('writeMultipleRegisters', function(value) {
  console.log('Write multiple registers - Existing: ', value)
})

server.on('postWriteMultipleRegisters', function(value) {
  console.log('Write multiple registers - Complete: ', value)
})

server.on('connection', function(client) {
  console.log('收到DTU注册封包：')
  client.socket.on('data', data => {
    console.log('myIP', client.socket.myIP)
    console.dir(client.socket.remoteAddress)
    console.log('data原始值: ', data, data.toString('ascii'))
    let id = data.slice(0, 4)
    let ip = data.slice(data.length - 5, data.length - 1)
    let simNumber = data.slice(3, data.length - 6)
    id = toId(id)
    ip = toIp(ip)

    console.log('id:', id)
    console.log('simNumber:', simNumber.toString())
    console.log('ip:', ip)
    client.socket.myIP = ip
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

netServer.listen(14444, function() {
  console.log('TCP serv is start at 14444 port.')
})

function toId(buf) {
  buf = buf.reduce((acc, next) => {
    if (next === 0) return acc
    return next.toString(16) + acc
  }, '')
  return buf
}

function toIp(ip) {
  ip = ip.reduce((acc, next) => {
    if (!acc) return acc + next
    return acc + '.' + next
  }, '')
  return ip
}
