
let backendHost = process.env.BACKEND_HOST || 'http://10.244.1.16';
let backendPort = process.env.BACKEND_PORT || 8000;
let backendUrl = backendHost + ':' + backendPort;

module.exports = {
    backendHost: backendHost,
    backendPort: backendPort,
    backendUrl: backendUrl
}