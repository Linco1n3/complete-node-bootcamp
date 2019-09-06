const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

////////////////////////////////////////////////////////////////
//Files

// Blocking, sychronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error reading');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
            
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//                 console.log("Your file has been written ");
//             })
//         });
//     });
// });
// console.log("Will read file!");
////////////////////////////////////////////////////////////////
// SERVER
// Read html template and data to memory before handling requests
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // regular expression to replace in global scope
                                                                        // let keyword declare output in local scope
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview-template.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card-template.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product-template.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj= JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));
console.log(slugs);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    
    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html'});
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        //console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        
        res.end(output);
        
    // Product page
    } else if (pathname === '/product') {
        
        res.writeHead(200, { 'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        
        res.end(output);
        
    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.end(data);
        
    // Not found
    } else {
        res.writeHead(404, { 
            'Content-type': 'text/html',
            'my-own-hear': 'hello world'
        });
        res.end('<h1>Page not found</h1>');
    }
       
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});