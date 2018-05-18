const http = require('http');

const hostname = '0.0.0.0';
const port = 14441;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Test DMZ - Jerry - home</h1>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.on('error', err => {
  console.error(err)
})