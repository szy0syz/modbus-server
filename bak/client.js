'use strict'

let modbus = require('jsmodbus')
let net = require('net')
let socket = new net.Socket()
let options = {
  host: '127.0.0.1',
  port: '4444'
}
let client = new modbus.client.TCP(socket)

socket.on('connect', function() {
  client
    .readCoils(3, 6)
    .then(function(resp) {
      console.log('resp~ ', resp)
      socket.end()
    })
    .catch(function() {
      console.error(arguments)
      socket.end()
    })
})

socket.on('error', console.error)
socket.connect(options)
