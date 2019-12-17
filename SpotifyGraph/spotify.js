const PORT =  1234;

let http = require('http');
let server =  http.createServer(handleRequest);

server.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);

function handleRequest(req , res) {

    res.writeHead(200, {
        'Content-type' : 'text/plain'
    });
    res.write('Hello World');
    res.end();
}
