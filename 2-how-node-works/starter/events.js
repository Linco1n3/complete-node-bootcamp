const EventEmitter = require('events');
const http = require('http');

const myEmitter = new EventEmitter();

myEmitter.on('newSale', () => {
    console.log('There was a new sale')
})
myEmitter.on('newSale', () => {
    console.log("customer name: Jonas");
})

myEmitter.emit('newSale');

////////////////////////////////////////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
    console.log('Request received');
    res.end('Request received');
})
server.on("request", (req, res) => {
    console.log('Another request received');
    res.end('Another request received');
})

server.on('close', () => {
    console.log('server closed');
})

server.listen(8000, '127.0.0.1', () => {
    console.log('waiting for request...')
});
