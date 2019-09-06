const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 2; // set thread pool size

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log("Immediate 1 finished"));

// create event-loop
fs.readFile('test-file.txt', () => {
    console.log('I/O finished');
    console.log("------------");
    setTimeout(() => console.log('Timer 2 finished'), 0);
    setTimeout(() => console.log('Timer 3 finished'), 3000);
    setImmediate(() => console.log("Immediate 2 finished"));
    
    process.nextTick(() => console.log("process nextTick"))
    
    // prove threadpool size is 4
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, "Password encrypted");
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, "Password encrypted");
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, "Password encrypted");
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, "Password encrypted");
    });
})

console.log("Hello from the top-level code");