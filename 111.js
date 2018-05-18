// const buf = Buffer.from([0x62, 0x75, 0x72])
// const nn = Buffer.from(buf, 0, 2)
// // console.log(nn.length)
// const res = buf.reduce((perv, next) => {
//   return next.toString(16) + perv
// }, '')

// console.log(res)

function ip2int(ip) {
  var num = 0
  ip = ip.split('.')
  num =
    Number(ip[0]) * 256 * 256 * 256 +
    Number(ip[1]) * 256 * 256 +
    Number(ip[2]) * 256 +
    Number(ip[3])
  num = num >>> 0
  return num
}

function int2iP(num){  
  var str;  
  var tt = new Array();  
  tt[0] = (num >>> 24) >>> 0;  
  tt[1] = ((num << 8) >>> 24) >>> 0;  
  tt[2] = (num << 16) >>> 24;  
  tt[3] = (num << 24) >>> 24;  
  str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);  
  return str;  
} 

console.log(ip2int('192.168.1.195'))