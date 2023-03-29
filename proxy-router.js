const http = require('http');
const fs = require('fs');

const port = 3000;
const configPath = './config.js';

// Load the initial configuration
let domainToPort = require(configPath);

// Watch the configuration file for changes and reload the configuration
fs.watchFile(configPath, { persistent: true, interval: 1000 * 60 }, () => {
    console.log('Configuration file changed, reloading...');
    delete require.cache[require.resolve(configPath)];
    domainToPort = require(configPath);
});

// Create a web server that listens for incoming requests
const server = http.createServer((req, res) => {
    const domain = req.headers.host;

    // Get the target port for the domain, or return a 500 error if the domain is not defined
    const targetPort = domainToPort[domain];

    if (!targetPort) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Not Configured (${domain})`);
        return;
    }

    // Set up the options for proxying the request
    const options = {
        hostname: 'localhost',
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    // Create a new request to the target server
    const proxyReq = http.request(options, (proxyRes) => {
        // Set the response headers and status code
        res.writeHead(proxyRes.statusCode, proxyRes.headers);

        // Pipe the response data from the target server to the client
        proxyRes.pipe(res, { end: true });
    });

    // Pipe the request data from the client to the target server
    req.pipe(proxyReq, { end: true });

    // Handle errors
    proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service Unavailable');
    });
});

// Start the web server
server.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});