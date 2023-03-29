# proxy-router
This is a simple Node.js HTTP proxy server that forwards incoming requests to different ports based on the requested domain / host header. This is useful for having a single web server to host multiple websites or APIs, which can each resolve to a separate process on a different port.

### Configuration
- Zero dependencies!
- Edit the port to listen on in proxy-router.js
- Edit config.js (you can even edit it while the proxy server is running - it will hot reload within a minute)
- `node proxy-router`

That's it! Enjoy.